import { BoxGeometry, Mesh, MeshNormalMaterial } from 'three'
import { addScene } from './scenes'
import { EngineScene } from './EngineScene'
import { uid } from 'uid'

let debugScene: EngineScene | undefined

export const getDebugScene = (): EngineScene => {
  if (!debugScene) throw new Error('No sketches server url')

  return debugScene
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
