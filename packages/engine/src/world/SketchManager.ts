import { Group } from 'three'
import { Pass } from 'postprocessing'
import { PassNode } from 'three/webgpu'
import { type ShaderNodeObject } from 'three/tsl'
import { ShotArgsObject } from '@HedronEngine/types'
import { SketchModule } from '@store/types'
import { getDebugScene } from '@world/debugScene'
import { EngineScene } from '@world/EngineScene'

type SketchUpdateParams = {
  deltaFrame: number
  deltaTime: number
  params: { [key: string]: unknown }
  scene: EngineScene
}

type ShotFunc = (
  args: Omit<SketchUpdateParams, 'deltaFrame' | 'deltaTime'> & { shotArgs: ShotArgsObject },
) => void

enum SketchErrorType {
  Create = 'Create',
  Dispose = 'Dispose',
}

type SketchManagerErrorHandler = (sketchInstanceId: string, type?: SketchErrorType) => void

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
} & Record<string, ShotFunc>

export type SketchInstanceMap = Map<string, SketchInstance>

export type SketchInstanceError = (sketchInstanceId: string, errorType?: SketchErrorType) => void

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
      const sketchInstance = new module(scene) as SketchInstance
      sketchInstance.id = instanceId

      if (sketchInstance.root) {
        sketchInstance.root.name = instanceId
      }

      this.sketchInstances.set(instanceId, sketchInstance)

      return sketchInstance
    } catch (error) {
      console.error('Failed to create sketch:', error)
      this.onError(instanceId, SketchErrorType.Create)
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
      this.onError(instanceId, SketchErrorType.Dispose)
    }

    this.sketchInstances.delete(instanceId)
  }

  public getSketchInstances = () => {
    return this.sketchInstances
  }
}
