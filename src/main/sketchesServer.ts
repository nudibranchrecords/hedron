import * as esbuild from 'esbuild'

const PORT = 3030
const HOST = '0.0.0.0'

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
    entryPoints: ['/Users/alex/Desktop/sketches/sketches/**/index.js'],
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
