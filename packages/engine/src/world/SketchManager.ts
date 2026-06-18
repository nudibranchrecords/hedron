import {
  SketchInstance,
  SketchInstanceErrorType,
  SketchInstanceMap,
  SketchModule,
} from '@store/types'
import { getDebugScene } from '@world/debugScene'
import { EngineScene } from '@world/EngineScene'

type SketchManagerErrorHandler = (sketchInstanceId: string, type?: SketchInstanceErrorType) => void

export class SketchManager {
  private sketchInstances: SketchInstanceMap = new Map()
  private onError: SketchManagerErrorHandler

  constructor({ onError }: { onError: SketchManagerErrorHandler }) {
    this.onError = onError
  }

  private createSketch = (
    instanceId: string,
    module: SketchModule,
    scene: EngineScene,
  ): SketchInstance | undefined => {
    try {
      const sketchInstance = new module(scene)
      sketchInstance.id = instanceId

      if (sketchInstance.root) {
        sketchInstance.root.name = instanceId
      }

      this.sketchInstances.set(instanceId, sketchInstance)

      return sketchInstance
    } catch (error) {
      console.error('Failed to create sketch:', error)
      this.onError(instanceId, 'Create')
    }
  }

  public addSketchToScene = (
    instanceId: string,
    module: SketchModule,
  ): SketchInstance | undefined => {
    const engineScene = getDebugScene()
    const scene = engineScene.scene
    const sketch = this.createSketch(instanceId, module, engineScene)
    if (sketch?.root) {
      scene.add(sketch.root)
    }

    return sketch
  }

  public removeSketchFromScene = (instanceId: string): void => {
    const engineScene = getDebugScene()
    const scene = engineScene.scene
    const oldSketchRoot = scene.getObjectByName(instanceId)

    if (!oldSketchRoot) {
      return
    } else {
      scene.remove(oldSketchRoot)
    }

    try {
      this.sketchInstances.get(instanceId)?.dispose?.(engineScene)
    } catch (error) {
      console.error(`Error disposing sketch instance ${instanceId}:`, error)
      this.onError(instanceId, 'Dispose')
    }

    this.sketchInstances.delete(instanceId)
  }

  public reorderSketchesInScene = (sketchInstanceIds: string[]): void => {
    const oldMap = this.sketchInstances
    this.sketchInstances = new Map()

    sketchInstanceIds.forEach((id) => {
      const sketchInstance = oldMap.get(id)
      if (sketchInstance) {
        this.sketchInstances.set(id, sketchInstance)
      } else {
        console.warn(`Sketch instance with id ${id} not found during reorder.`)
      }
    })
  }

  public getSketchInstances = () => {
    return this.sketchInstances
  }
}
