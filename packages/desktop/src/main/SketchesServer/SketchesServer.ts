import { EventEmitter } from 'events'
import path from 'path'
import chokidar, { FSWatcher } from 'chokidar'
import { app } from 'electron'
import * as esbuild from 'esbuild'
import { emptyDirSync } from 'fs-extra'
import { getPort } from 'get-port-please'
import { createGlobalVarModuleFiles, watchWithDebounce } from './utils'
import { FileWatchEvents } from '@shared/Events'
import { getEsbuild } from '@main/getUnpackedModules'

const HOST = process.platform.startsWith('win') ? 'localhost' : '0.0.0.0'

export class SketchesServer extends EventEmitter {
  private isFirstBuildComplete: boolean
  private esbuildContext?: esbuild.BuildContext
  private watcher?: FSWatcher

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

    /**
      Here we are generating files such as `THREE.js` that the sketches server will serve up. These are a faked modules that are
      pointing to the same instance of three that Hedron uses.
      Esbuild will resolve any imports (e.g. `import { BufferGeometry } from 'three'`) to point to these files instead.
      See `.sketches-server/` for all the generated files.
    */
    const { globalVarsRef } = await import('@hedron/engine')
    await createGlobalVarModuleFiles(outdir, globalVarsRef)

    const ctx = await esbuild.context({
      entryPoints: [
        `${entryBase}/**/index.js`,
        `${entryBase}/**/config.js`,
        `${entryBase}/**/index.ts`,
        `${entryBase}/**/config.ts`,
      ],
      outdir,
      // `outbase` is needed to preserve sketches folder structure in the outdir
      outbase: entryBase,
      loader: {
        // https://esbuild.github.io/content-types/
        // file: loaded into sketch as path
        '.glb': 'file',
        '.fbx': 'file',
        '.obj': 'file',
        '.dae': 'file',
        '.png': 'file',
        '.jpg': 'file',
        '.jpeg': 'file',
        '.gif': 'file',
        '.svg': 'file',
        '.mp3': 'file',
        '.mp4': 'file',
        '.ogg': 'file',
        '.wav': 'file',
        '.hdr': 'file',
        '.ttf': 'file',
        '.otf': 'file',
        // text: loaded into sketch as string
        '.glsl': 'text',
        '.isf': 'text',
        '.ply': 'text',
        '.frag': 'text',
        '.vert': 'text',
        '.json': 'text',
      },
      assetNames: '[dir]/[name]-[hash]',
      publicPath: `http://${HOST}:${port}`,
      bundle: true,
      format: 'esm',
      external: globalVarsRef.vars.map((v) => v.packageName),
      plugins: [
        {
          name: 'global-var-package-resolver',
          setup: (build): void => {
            // Resolve any package defined in the `@hedron/engine` to point to Hedron's global vars
            for (const { varName, packageName } of globalVarsRef.vars) {
              build.onResolve({ filter: new RegExp(`^${packageName}$`) }, () => {
                return {
                  path: `/${varName}.js`,
                  external: true,
                }
              })
            }
          },
        },
        {
          name: 'on-end',
          setup: (build): void => {
            build.onEnd((result) => {
              // Emit build errors if any
              if (result.errors.length > 0) {
                this.emit(FileWatchEvents.buildErrors, result.errors)
              }

              // Emit build warnings if any
              if (result.warnings.length > 0) {
                this.emit(FileWatchEvents.buildWarnings, result.warnings)
              }

              // Emit success if no errors
              if (result.errors.length === 0) {
                this.emit(FileWatchEvents.buildSuccess)
              }

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
    console.log(`Serving directory: ${outdir}`)

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

    // Store references for shutdown
    this.esbuildContext = ctx
    this.watcher = watcher

    return { host, port }
  }

  shutdown = async (): Promise<void> => {
    try {
      // Close the watcher if it exists
      if (this.watcher) {
        await this.watcher.close()
        this.watcher = undefined
      }

      // Stop the esbuild context if it exists
      if (this.esbuildContext) {
        await this.esbuildContext.dispose()
        this.esbuildContext = undefined
      }

      console.log('[HEDRON] Sketches server shut down successfully')
    } catch (error) {
      console.error('[HEDRON] Error shutting down sketches server:', error)
    }
  }
}
