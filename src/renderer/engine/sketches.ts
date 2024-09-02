import { getDebugScene } from './debugScene'
import { getSketchesServerUrl } from './globals'
import { useAppStore } from './sketchesState'

// TODO: type this!
// ts: ignore
type Sketch = any

export const createSketch = (sketchId: string, instanceId: string): Sketch => {
  const base = getSketchesServerUrl()

  const modules = useAppStore.getState().sketchModules
  const module = modules[sketchId].module

  const sketch = new module({ sketchesDir: base })
  sketch.root.name = instanceId
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
}
