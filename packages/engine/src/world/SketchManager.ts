import { Group } from 'three'
import { Pass } from 'postprocessing'
import { SketchModule } from '@store/types'
import { getDebugScene } from '@world/debugScene'
import { EngineScene } from '@world/EngineScene'

type SketchUpdateParams = {
  deltaFrame: number
  deltaTime: number
  params: { [key: string]: unknown }
  scene: EngineScene
}

type SketchInstance = {
  update: (arg: SketchUpdateParams) => void
  root?: Group

  getPasses?: (engineScene: EngineScene) => Pass[]

  /**
   * Called when the sketch is removed from the scene.
   * It should clean up any resources, event listeners, or references it holds.
   */
  dispose(engineScene: EngineScene): () => void
}

export class SketchManager {
  private sketchInstances: { [id: string]: SketchInstance } = {}

  private createSketch = (
    instanceId: string,
    module: SketchModule,
    scene: EngineScene,
  ): SketchInstance => {
    const sketch = new module(scene)
    if (sketch.root) {
      sketch.root.name = instanceId
    }

    this.sketchInstances[instanceId] = sketch

    return sketch
  }

  public addSketchToScene = (instanceId: string, module: SketchModule): void => {
    const engineScene = getDebugScene()
    const scene = engineScene.scene
    const sketch = this.createSketch(instanceId, module, engineScene)
    if (sketch.root) {
      scene.add(sketch.root)
    }
  }

  public removeSketchFromScene = (instanceId: string): void => {
    const engineScene = getDebugScene()
    const scene = engineScene.scene
    const oldSketch = scene.getObjectByName(instanceId)

    if (!oldSketch) {
      throw new Error(`couldn't find sketch to remove: ${instanceId}`)
    }

    scene.remove(oldSketch)
    this.sketchInstances[instanceId]?.dispose?.(engineScene)
    delete this.sketchInstances[instanceId]
  }

  public getSketchInstances = () => {
    return this.sketchInstances
  }
}
