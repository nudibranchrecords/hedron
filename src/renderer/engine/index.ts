import { uid } from 'uid'
import { EngineScene } from './EngineScene'
import { BoxGeometry, Mesh, MeshBasicMaterial, MeshNormalMaterial } from 'three'
import { render } from './renderer'

let sketchesServerUrl: string | undefined
let debugScene: EngineScene | undefined

const getSketchesServerUrl = (): string => {
  if (!sketchesServerUrl) throw new Error('No sketches server url')

  return sketchesServerUrl
}

const getDebugScene = (): EngineScene => {
  if (!debugScene) throw new Error('No sketches server url')

  return debugScene
}

export const engineScenes = new Map<string, EngineScene>()

export const addScene = (sceneId: string): EngineScene => {
  const newScene = new EngineScene()
  engineScenes.set(sceneId, newScene)

  // renderer.setSize()
  // if (shouldSetPost) renderer.setPostProcessing()

  return newScene
}

export const createDebugScene = (): EngineScene => {
  const id = uid()
  const scene = addScene(id)
  const geom = new BoxGeometry(1, 1, 1)
  const mat = new MeshNormalMaterial()
  const mesh = new Mesh(geom, mat)
  mesh.scale.set(2, 2, 2)
  scene.scene.add(mesh)

  debugScene = scene

  return debugScene
}

export const refreshSketch = async (sketchId: string): Promise<void> => {
  console.log(`Refreshing sketch: ${sketchId}`)
  const base = getSketchesServerUrl()
  const scene = getDebugScene().scene

  const oldSketch = scene.getObjectByName(sketchId)
  if (!oldSketch) {
    throw new Error(`couldn't find sketch to remove: ${sketchId}`)
  }

  scene.remove(oldSketch)
  const module = await import(/* @vite-ignore */ `${base}/${sketchId}/index.js?${uid()}`)
  const newSketch = new module.TestSketch({ sketchesDir: sketchesServerUrl })
  newSketch.root.name = sketchId
  scene.add(newSketch.root)

  console.log(scene)
}

export const run = async (_sketchesServerUrl: string): Promise<void> => {
  sketchesServerUrl = _sketchesServerUrl
  const debugScene = createDebugScene()

  const thing = await import(/* @vite-ignore */ `${sketchesServerUrl}/test-sketch/index.js`)

  const testSketch = new thing.TestSketch({ sketchesDir: sketchesServerUrl })
  testSketch.root.name = 'test-sketch'

  debugScene.scene.add(testSketch.root)

  const loop = (): void => {
    requestAnimationFrame(loop)
    if (debugScene) {
      render(debugScene)
    }
  }

  loop()
}
