import { SketchModule } from '../store/types'
import { getDebugScene } from './debugScene'

type SketchInstance = {
  // eslint-disable-next-line -- TODO: Type this!
  update: any
  // eslint-disable-next-line
  root: any
}

export class SketchManager {
  private sketchInstances: { [id: string]: SketchInstance } = {}

  private createSketch = (instanceId: string, module: SketchModule): SketchInstance => {
    const sketch = new module()
    sketch.root.name = instanceId

    this.sketchInstances[instanceId] = sketch

    return sketch
  }

  public addSketchToScene = (instanceId: string, module: SketchModule): void => {
    const scene = getDebugScene().scene
    const sketch = this.createSketch(instanceId, module)

    scene.add(sketch.root)
  }

  public removeSketchFromScene = (instanceId: string): void => {
    const scene = getDebugScene().scene
    const oldSketch = scene.getObjectByName(instanceId)

    if (!oldSketch) {
      throw new Error(`couldn't find sketch to remove: ${instanceId}`)
    }

    scene.remove(oldSketch)
    delete this.sketchInstances[instanceId]
  }

  public getSketchInstances = () => {
    return this.sketchInstances
  }
}
