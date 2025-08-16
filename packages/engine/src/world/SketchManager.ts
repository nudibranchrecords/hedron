import { Group } from 'three'
import { Pass } from 'postprocessing'
import { PassNode } from 'three/webgpu'
import { type ShaderNodeObject } from 'three/tsl'
import { SketchModule } from '@store/types'
import { getDebugScene } from '@world/debugScene'
import { EngineScene } from '@world/EngineScene'

type SketchUpdateParams = {
  deltaFrame: number
  deltaTime: number
  params: { [key: string]: unknown }
  scene: EngineScene
}

enum SketchManagerErrorType {
  Create = 'Create',
  Dispose = 'Dispose',
}

type SketchManagerErrorHandler = (sketchInstanceId: string, type: SketchManagerErrorType) => void

export type SketchInstance = {
  id: string
  update: (arg: SketchUpdateParams) => void
  root?: Group

  getPasses?: (engineScene: EngineScene) => Pass[]

  getWebGPUPass?: (prevPass: ShaderNodeObject<PassNode>) => ShaderNodeObject<PassNode>

  /**
   * Called when the sketch is removed from the scene.
   * It should clean up any resources, event listeners, or references it holds.
   */
  dispose(engineScene: EngineScene): () => void
}

export class SketchManager {
  private sketchInstances: { [id: string]: SketchInstance | undefined } = {}
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
      const sketchInstance = new module(scene) as SketchInstance
      sketchInstance.id = instanceId

      if (sketchInstance.root) {
        sketchInstance.root.name = instanceId
      }

      this.sketchInstances[instanceId] = sketchInstance

      return sketchInstance
    } catch (error) {
      // TODO: error toast
      console.error('Failed to create sketch:', error)
      this.onError(instanceId, SketchManagerErrorType.Create)
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
      this.sketchInstances[instanceId]?.dispose?.(engineScene)
    } catch (error) {
      console.error(`Error disposing sketch instance ${instanceId}:`, error)
      this.onError(instanceId, SketchManagerErrorType.Dispose)
    }

    delete this.sketchInstances[instanceId]
  }

  public getSketchInstances = () => {
    return this.sketchInstances
  }
}
