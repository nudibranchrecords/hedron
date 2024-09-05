import { useAppStore } from '../store/useAppStore'
import { getDebugScene } from './debugScene'
import { getSketchesServerUrl } from './globals'

// TODO: type this! (class instance with methods, eg. update())
type SketchInstance = {
  update: any
  root: any
}

export const sketchInstances: { [id: string]: SketchInstance } = {}

export const createSketch = (sketchId: string, instanceId: string): SketchInstance => {
  const base = getSketchesServerUrl()

  const modules = useAppStore.getState().sketchModules
  const module = modules[sketchId].module

  const sketch = new module({ sketchesDir: base })
  sketch.root.name = instanceId

  sketchInstances[instanceId] = sketch

  // console.log(sketchInstances)

  return sketch
}

export const addSketch = (sketchId: string, instanceId: string): void => {
  const scene = getDebugScene().scene
  const sketch = createSketch(sketchId, instanceId)
  scene.add(sketch.root)
}

export const removeSketch = (instanceId: string): void => {
  const scene = getDebugScene().scene
  const oldSketch = scene.getObjectByName(instanceId)
  if (!oldSketch) {
    throw new Error(`couldn't find sketch to remove: ${instanceId}`)
  }
  scene.remove(oldSketch)
  delete sketchInstances[instanceId]
}
