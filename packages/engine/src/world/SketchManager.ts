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

export type SketchInstance = {
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

  public addSketchToScene = (instanceId: string, module: SketchModule) => {
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
    const oldSketchRoot = scene.getObjectByName(instanceId)

    if (!oldSketchRoot) {
      return
    } else {
      scene.remove(oldSketchRoot)
    }

    this.sketchInstances[instanceId]?.dispose?.(engineScene)
    delete this.sketchInstances[instanceId]
  }

  public getSketchInstances = () => {
    return this.sketchInstances
  }
}
