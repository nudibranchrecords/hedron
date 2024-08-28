import * as esbuild from 'esbuild'
import path from 'path'
const userSettings = require(path.normalize(`${__dirname}/../../user-settings.json`));

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

export const createSketchesServer = async (): Promise<esbuild.ServeResult> => {
  const ctx = await esbuild.context({
    entryPoints: [userSettings.sketchEntry],
    outdir: 'sketches-server',
    loader: loaderFileExtensions,
    publicPath: `http://${HOST}:${PORT}`,
    bundle: true,
    format: 'esm',
  })

  const { host, port } = await ctx.serve({
    servedir: 'sketches-server',
    port: PORT,
    host: HOST,
  })

  return { host, port }
}
