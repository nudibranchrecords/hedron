import { uid } from 'uid'
import { getDebugScene } from './debugScene'
import { getSketchesServerUrl } from './globals'
import { getSketchesState } from './sketchesState'

// TODO: type this!
// ts: ignore
type Sketch = any

export const loadSketch = async (sketchId: string, instanceId: string): Promise<Sketch> => {
  const base = getSketchesServerUrl()
  const cacheBust = uid()
  const module = await import(/* @vite-ignore */ `${base}/${sketchId}/index.js?${cacheBust}`)
  const sketch = new module.default({ sketchesDir: base })
  sketch.root.name = instanceId
  return sketch
}

export const addSketch = async (sketchId: string, instanceId: string): Promise<void> => {
  const scene = getDebugScene().scene
  const sketch = await loadSketch(sketchId, instanceId)
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

  getSketchesState().forEach(async (item) => {
    if (item.sketchId !== sketchId) return

    removeSketch(item.id)
    const newSketch = await loadSketch(sketchId, item.id)
    scene.add(newSketch.root)
  })
}
