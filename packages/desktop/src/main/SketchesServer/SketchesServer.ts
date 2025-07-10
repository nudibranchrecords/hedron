import path from 'path'
import { EventEmitter } from 'events'
import chokidar from 'chokidar'
import { getPort } from 'get-port-please'
import { app } from 'electron'
import * as esbuild from 'esbuild'
import { emptyDirSync } from 'fs-extra'

import { generateModuleExportString, watchWithDebounce } from './utils'
import { getEsbuild } from '@main/getUnpackedModules'
import { FileWatchEvents } from '@shared/Events'

// import * as THREE from 'three'
// import * as THREE_TSL from 'three/tsl'

const HOST = process.platform.startsWith('win') ? 'localhost' : '0.0.0.0'

export class SketchesServer extends EventEmitter {
  private isFirstBuildComplete: boolean

  constructor() {
    super()
    this.isFirstBuildComplete = false
  }

  private copyThreeJsToOutput = async (outdir: string): Promise<void> => {
    const fs = require('fs')

    try {
      const THREE = await import('three')
      const threeProxy = generateModuleExportString(
        THREE,
        'three',
        'window.HEDRON.dependencies.THREE',
      )
      fs.writeFileSync(path.join(outdir, 'three.js'), threeProxy)

      const THREE_TSL = await import('three/tsl')
      const threeTslProxy = generateModuleExportString(
        THREE_TSL,
        'three/tsl',
        'window.HEDRON.dependencies.THREE_TSL',
      )
      fs.writeFileSync(path.join(outdir, 'three.tsl.js'), threeTslProxy)

      const THREE_WEBGPU = await import('three/webgpu')
      const threeWebgpuProxy = generateModuleExportString(
        THREE_WEBGPU,
        'three/webgpu',
        'window.HEDRON.dependencies.THREE_WEBGPU',
      )
      fs.writeFileSync(path.join(outdir, 'three.webgpu.js'), threeWebgpuProxy)

      this.createImportMap(outdir)
    } catch (error) {
      console.error('Failed to create Three.js proxy modules:', error)
    }
  }

  private createImportMap = (outdir: string): void => {
    const importMap = {
      imports: {
        three: '/three.js',
        'three/': '/',
        'three/tsl': '/three.tsl.js',
        'three/webgpu': '/three.webgpu.js',
      },
    }

    const importMapPath = path.join(outdir, 'importmap.json')
    const fs = require('fs')
    fs.writeFileSync(importMapPath, JSON.stringify(importMap, null, 2))
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

    // Copy Three.js to output directory so it can be served
    await this.copyThreeJsToOutput(outdir)

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
        '.hdr': 'file',
        // text: loaded into sketch as string
        '.glsl': 'text',
        '.isf': 'text',
        '.frag': 'text',
        '.vert': 'text',
      },
      assetNames: '[dir]/[name]-[hash]',
      publicPath: `http://${HOST}:${port}`,
      bundle: true,
      format: 'esm',
      // Make three.js external to avoid bundling multiple versions
      external: ['three', 'three/*'],
      plugins: [
        {
          name: 'three-js-resolver',
          setup: (build): void => {
            // Resolve 'three' imports to use the served version
            build.onResolve({ filter: /^three$/ }, () => {
              return {
                path: '/three.js',
                external: true,
              }
            })

            // Resolve any Three.js submodule imports
            build.onResolve({ filter: /^three\/.*/ }, (args) => {
              const submodulePath = args.path.replace('three/', '')

              // Handle specific known submodules
              if (submodulePath === 'tsl') {
                return {
                  path: '/three.tsl.js',
                  external: true,
                }
              }

              if (submodulePath === 'webgpu') {
                return {
                  path: '/three.webgpu.js',
                  external: true,
                }
              }

              // For other submodules, fall back to unpkg
              const fallbackPath = `https://unpkg.com/three@0.178.0/${submodulePath}`
              return {
                path: fallbackPath,
                external: true,
              }
            })
          },
        },
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

    return { host, port }
  }
}
