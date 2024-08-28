import { uid } from 'uid'
import { getDebugScene } from './debugScene'
import { getSketchesServerUrl } from './globals'

// TODO: type this!
type Sketch = any

export const loadSketch = async (sketchId: string): Promise<Sketch> => {
  const base = getSketchesServerUrl()
  const cacheBust = uid()
  const module = await import(/* @vite-ignore */ `${base}/${sketchId}/index.js?${cacheBust}`)
  const sketch = new module.default({ sketchesDir: base })
  sketch.root.name = sketchId
  return sketch
}

export const removeSketch = (sketchId: string): void => {
  const scene = getDebugScene().scene
  const oldSketch = scene.getObjectByName(sketchId)
  if (!oldSketch) {
    throw new Error(`couldn't find sketch to remove: ${sketchId}`)
  }
  scene.remove(oldSketch)
}

export const refreshSketch = async (sketchId: string): Promise<void> => {
  const scene = getDebugScene().scene
  removeSketch(sketchId)
  const newSketch = await loadSketch(sketchId)
  scene.add(newSketch.root)
}
