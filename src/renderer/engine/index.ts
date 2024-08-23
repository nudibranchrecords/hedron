import { uid } from 'uid'
import { EngineScene } from './EngineScene'
import {
  BoxGeometry,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
} from 'three'
import { render } from './renderer'

export const scenes = new Map<string, EngineScene>()
let debugScene: EngineScene | undefined

export const addScene = (sceneId: string): EngineScene => {
  const newScene = new EngineScene()
  scenes.set(sceneId, newScene)

  // renderer.setSize()
  // if (shouldSetPost) renderer.setPostProcessing()

  return newScene
}

export const createDebugScene = (): void => {
  const id = uid()
  const scene = addScene(id)
  const geom = new BoxGeometry(1, 1, 1)
  const mat = new MeshBasicMaterial({ color: 0x00ff00 })
  const mesh = new Mesh(geom, mat)

  scene.scene.add(mesh)
  scene.setRatio(0.5)

  debugScene = scene

  console.log(scene)
}

export const run = (): void => {
  createDebugScene()

  const loop = (): void => {
    requestAnimationFrame(loop)
    console.log(debugScene)
    if (debugScene) render(debugScene)
  }

  loop()
}
