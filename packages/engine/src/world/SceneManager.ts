import {
  SketchInstance,
  SketchInstanceErrorType,
  SketchInstanceMap,
  SketchModule,
} from '@store/types'
import { EngineScene } from '@world/EngineScene'
import { Renderer } from '@world/Renderer'
import { engineScenes } from '@world/scenes'

type SceneManagerErrorHandler = (sketchInstanceId: string, type?: SketchInstanceErrorType) => void

export class SceneManager {
  private sceneInstances: Map<string, EngineScene> = new Map()
  private onError: SceneManagerErrorHandler
  private renderer: Renderer

  constructor({ onError, renderer }: { onError: SceneManagerErrorHandler; renderer: Renderer }) {
    this.onError = onError
    this.renderer = renderer
  }

  private createSketchInstance = (
    instanceId: string,
    module: SketchModule,
    engineScene: EngineScene,
  ): SketchInstance | undefined => {
    try {
      const sketchInstance = new module(engineScene)
      sketchInstance.id = instanceId

      if (sketchInstance.root) {
        sketchInstance.root.name = instanceId
      }

      return sketchInstance
    } catch (error) {
      console.error('Failed to create sketch:', error)
      this.onError(instanceId, 'Create')
    }
  }

  public addScene = (sceneId: string): EngineScene => {
    const existingScene = this.sceneInstances.get(sceneId)
    if (existingScene) {
      return existingScene
    }

    const newScene = new EngineScene({
      rendererType: this.renderer.rendererType,
      renderer: this.renderer.renderer,
      onSketchInstanceError: this.onError,
    })

    newScene.setRatio(this.renderer.aspectRatio)

    this.sceneInstances.set(sceneId, newScene)
    engineScenes.set(sceneId, newScene)
    return newScene
  }

  public getScene = (sceneId: string): EngineScene | null => {
    return this.sceneInstances.get(sceneId) ?? null
  }

  public removeScene = (sceneId: string): void => {
    const engineScene = this.sceneInstances.get(sceneId)
    if (!engineScene) {
      return
    }

    Array.from(engineScene.sketches.keys()).forEach((sketchId) => {
      this.removeSketchFromScene(sceneId, sketchId)
    })

    this.sceneInstances.delete(sceneId)
    engineScenes.delete(sceneId)
  }

  public addSketchToScene = (
    sceneId: string,
    sketchInstanceId: string,
    module: SketchModule,
  ): SketchInstance | undefined => {
    const engineScene = this.getScene(sceneId)
    if (!engineScene) {
      return undefined
    }

    const sketch = this.createSketchInstance(sketchInstanceId, module, engineScene)

    if (sketch?.root) {
      engineScene.scene.add(sketch.root)
    }

    if (sketch) {
      engineScene.sketches.set(sketchInstanceId, sketch)
    }

    return sketch
  }

  public removeSketchFromScene = (sceneId: string, sketchInstanceId: string): void => {
    const engineScene = this.sceneInstances.get(sceneId)
    if (!engineScene) {
      return
    }

    const oldSketchRoot = engineScene.scene.getObjectByName(sketchInstanceId)

    if (oldSketchRoot) {
      engineScene.scene.remove(oldSketchRoot)
    }

    try {
      engineScene.sketches.get(sketchInstanceId)?.dispose?.(engineScene)
    } catch (error) {
      console.error(`Error disposing sketch instance ${sketchInstanceId}:`, error)
      this.onError(sketchInstanceId, 'Dispose')
    }

    engineScene.sketches.delete(sketchInstanceId)
  }

  public reorderSketchesInScene = (sceneId: string, sketchInstanceIds: string[]): void => {
    const engineScene = this.sceneInstances.get(sceneId)
    if (!engineScene) {
      return
    }

    const oldMap = engineScene.sketches
    engineScene.sketches = new Map()

    sketchInstanceIds.forEach((id) => {
      const sketchInstance = oldMap.get(id)
      if (sketchInstance) {
        engineScene.sketches.set(id, sketchInstance)
      } else {
        console.warn(`Sketch instance with id ${id} not found during reorder.`)
      }
    })
  }

  public getSketchInstances = (sceneId: string): SketchInstanceMap => {
    return this.getScene(sceneId)?.sketches ?? new Map()
  }
}
