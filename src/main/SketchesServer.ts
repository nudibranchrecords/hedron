import path from 'path'
import chokidar from 'chokidar'
import { EventEmitter } from 'events'
import { getPort } from 'get-port-please'
import { app } from 'electron'
import { getEsbuild } from './getUnpackedModules'
import * as esbuild from 'esbuild'

const sketchesServerOutputPath = path.normalize(`${__dirname}/../../sketches-server`)

const HOST = process.platform.startsWith('win') ? 'localhost' : '0.0.0.0'

const fileExtensions = [
  'glb',
  'fbx',
  'obj',
  'png',
  'jpg',
  'jpeg',
  'gif',
  'svg',
  'mp3',
  'mp4',
  'ogg',
  'wav',
]

const loaderFileExtensions: { [key: string]: 'file' } = {}
fileExtensions.forEach((ext) => {
  loaderFileExtensions[`.${ext}`] = 'file'
})

const getSketchIdFromPath = (path: string): string => {
  const pieces = path.split('/')
  const index = pieces.findIndex((val) => val === 'sketches-server') + 1
  return pieces[index]
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
    // TODO: Make outdir unique, in case of multiple Hedron instances. Also cleanup folder...
    const outdir = path.normalize(`${app.getPath('temp')}/hedron/sketches-server`)

    const ctx = await esbuild.context({
      entryPoints: [
        `${entryBase}/**/index.js`,
        `${entryBase}/**/config.js`,
        `${entryBase}/**/index.ts`,
        `${entryBase}/**/config.ts`,
      ],
      outdir,
      loader: loaderFileExtensions,
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

    const watcher = chokidar.watch(sketchesServerOutputPath, {
      persistent: true,
      ignoreInitial: true,
    })

    watcher.on('change', (path) => {
      if (!this.isFirstBuildComplete) return
      this.emit('change', getSketchIdFromPath(path))
    })

    watcher.on('add', (path) => {
      this.emit('add', getSketchIdFromPath(path))
    })

    return { host, port }
  }
}
