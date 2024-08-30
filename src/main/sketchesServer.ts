import * as esbuild from 'esbuild'
import path from 'path'
import chokidar from 'chokidar'
import { EventEmitter } from 'events'

const userSettingsPath = path.normalize(`${__dirname}/../../user-settings.json`)
const sketchesServerOutputPath = path.normalize(`${__dirname}/../../sketches-server`)

const userSettings = require(userSettingsPath)

const PORT = 3030
const HOST = 'localhost'

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

  init = async (): Promise<esbuild.ServeResult> => {
    const ctx = await esbuild.context({
      entryPoints: [userSettings.sketchEntry],
      outdir: 'sketches-server',
      loader: loaderFileExtensions,
      assetNames: '[dir]/[name]-[hash]',
      publicPath: `http://${HOST}:${PORT}`,
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

    const { host, port } = await ctx.serve({
      servedir: 'sketches-server',
      port: PORT,
      host: HOST,
    })

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
