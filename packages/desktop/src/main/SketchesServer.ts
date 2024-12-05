import path from 'path'
import { EventEmitter } from 'events'
import chokidar, { FSWatcher } from 'chokidar'
import { getPort } from 'get-port-please'
import { app } from 'electron'
import * as esbuild from 'esbuild'
import { emptyDirSync } from 'fs-extra'
import { getEsbuild } from '@main/getUnpackedModules'
import { FileWatchEvents } from '@shared/Events'
import { debounceWithId } from '@shared/utils/debounceWithId'

const HOST = process.platform.startsWith('win') ? 'localhost' : '0.0.0.0'

const WATCH_DEBOUNCE_MS = 300

const getSketchIdFromPath = (sketchPath: string): string => {
  const folderName = path.dirname(sketchPath).split(path.sep).pop()
  if (!folderName) return sketchPath
  return folderName
}

const watchWithDebounce = (
  watcher: FSWatcher,
  eventName: string,
  cb: (path: string, moduleId: string) => void,
) => {
  watcher.on(eventName, (path) => {
    const id = getSketchIdFromPath(path)

    debounceWithId(
      () => {
        cb(path, id)
      },
      WATCH_DEBOUNCE_MS,
      id + eventName,
    )
  })
}

export class SketchesServer extends EventEmitter {
  private isFirstBuildComplete: boolean

  constructor() {
    super()
    this.isFirstBuildComplete = false
  }

  init = async (dirPath: string): Promise<esbuild.ServeResult> => {
    const esbuild = getEsbuild()
    const port = await getPort({ host: HOST })

    const entryBase = dirPath

    // we want the temp sketches-dir to be inside this project during development, just so we can see what's being generated
    const outdir = app.isPackaged
      ? path.normalize(`${app.getPath('temp')}/hedron/sketches-server`)
      : '.sketches-server'

    // Clear out sketches-server dir
    emptyDirSync(outdir)

    const ctx = await esbuild.context({
      entryPoints: [
        `${entryBase}/**/index.js`,
        `${entryBase}/**/config.js`,
        `${entryBase}/**/index.ts`,
        `${entryBase}/**/config.ts`,
      ],
      outdir,
      loader: {
        // https://esbuild.github.io/content-types/
        // file: loaded into sketch as path
        '.glb': 'file',
        '.fbx': 'file',
        '.obj': 'file',
        '.png': 'file',
        '.jpg': 'file',
        '.jpeg': 'file',
        '.gif': 'file',
        '.svg': 'file',
        '.mp3': 'file',
        '.mp4': 'file',
        '.ogg': 'file',
        '.wav': 'file',
        // text: loaded into sketch as string
        '.glsl': 'text',
        '.isf': 'text',
      },
      assetNames: '[dir]/[name]-[hash]',
      publicPath: `http://${HOST}:${port}`,
      bundle: true,
      format: 'esm',
      plugins: [
        {
          name: 'on-end',
          setup: (build): void => {
            build.onEnd(() => {
              // setTimeout is needed because chokidar is overly sensitive and firing change events after first build is complete
              setTimeout(() => {
                this.isFirstBuildComplete = true
              }, 1000)
            })
          },
        },
      ],
    })

    console.log(`Starting server... http://${HOST}:${port}`)

    const { host } = await ctx.serve({
      servedir: outdir,
      port,
      host: HOST,
    })

    console.log(`Running sketches server: http://${HOST}:${port}`)

    await ctx.watch()

    const watcher = chokidar.watch(outdir, {
      // @ts-expect-error -- TODO: Update chokidar when types are fixed
      ignored: (file, stats) =>
        // Only watch for changes to generated index and config files
        // Note: When imported assets are edited (e.g. a GLB file), the index file will still update
        //       so no need to watch anything else!
        stats && stats.isFile() && !(file.endsWith('index.js') || file.endsWith('config.js')),
      ignoreInitial: true,
    })

    watchWithDebounce(watcher, FileWatchEvents.change, (_, id) => {
      if (!this.isFirstBuildComplete) return
      this.emit(FileWatchEvents.change, id)
    })

    watchWithDebounce(watcher, FileWatchEvents.add, (_, id) => {
      this.emit(FileWatchEvents.add, id)
    })

    watchWithDebounce(watcher, FileWatchEvents.unlink, (_, id) => {
      this.emit(FileWatchEvents.unlink, id)
    })

    return { host, port }
  }
}
