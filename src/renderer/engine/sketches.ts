import { getDebugScene } from './debugScene'
import { getSketchesServerUrl } from './globals'
import { getSketchesState, useAppStore } from './sketchesState'

// TODO: type this!
// ts: ignore
type Sketch = any

export const loadSketch = (sketchId: string, instanceId: string): Sketch => {
  const base = getSketchesServerUrl()

  const sketchLibrary = useAppStore.getState().sketchLibrary
  const module = sketchLibrary[sketchId].module

  const sketch = new module.default({ sketchesDir: base })
  sketch.root.name = instanceId
  return sketch
}

export const addSketch = (sketchId: string, instanceId: string): void => {
  const scene = getDebugScene().scene
  const sketch = loadSketch(sketchId, instanceId)
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

export const refreshSketch = async (sketchId: string): Promise<void> => {
  const scene = getDebugScene().scene
  // TODO: Fix this with cache busting reload of sketchLibrary module

  getSketchesState().forEach(async (item) => {
    if (item.sketchId !== sketchId) return

    removeSketch(item.id)
    const newSketch = await loadSketch(sketchId, item.id)
    scene.add(newSketch.root)
  })
}
