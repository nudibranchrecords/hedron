import { Group } from 'three'
import { Pass } from 'postprocessing'
import { NodeParamWithChildren, SketchModule } from '@store/types'
import { getDebugScene } from '@world/debugScene'
import { EngineScene } from '@world/EngineScene'
import { HedronEngine } from 'src/HedronEngine/HedronEngine'

type SketchInstance = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: any
  root?: Group

  getPasses?: (engineScene: EngineScene) => Pass[]
}

let instance: SketchManager
export function fireShotOnSketch(instanceId: string, functionName: string) {
  instance.fireShotOnSketch(instanceId, functionName)
}

export class SketchManager {
  private sketchInstances: { [id: string]: SketchInstance } = {}

  private engine: HedronEngine

  constructor(engine: HedronEngine) {
    this.engine = engine
    SketchManager.setInstance(this)
  }

  private static setInstance(self: SketchManager) {
    instance = self
  }

  private createSketch = (instanceId: string, module: SketchModule): SketchInstance => {
    const sketch = new module()
    if (sketch.root) {
      sketch.root.name = instanceId
    }

    this.sketchInstances[instanceId] = sketch

    return sketch
  }

  public addSketchToScene = (instanceId: string, module: SketchModule): void => {
    const scene = getDebugScene().scene
    const sketch = this.createSketch(instanceId, module)
    if (sketch.root) {
      scene.add(sketch.root)
    }
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

  public fireShotOnSketch(instanceId: string, functionName: string): void {
    const sketch = this.sketchInstances[instanceId]
    if (!sketch) {
      throw new Error(`couldn't find sketch to fire shot on: ${instanceId}`)
    }

    const params = (sketch as any)[functionName]?.()
    if (!params) {
      return
    }

    const state = this.engine.getStore().getState()
    const storedParams = state.params
    Object.keys(params).forEach((key) => {
      const param = params[key]
      for (const id in storedParams) {
        const storedParam = storedParams[id]
        if (storedParam.sketchId !== instanceId || storedParam.key !== key) {
          continue
        }
        if (!Array.isArray(param)) {
          this.engine.getStore().getState().updateParamValue(storedParam.id, params[key])
          return
        }
        const length = Math.min(
          param.length,
          (storedParam as NodeParamWithChildren).childNodeIds.length,
        )
        for (let i = 0; i < length; i++) {
          state.updateParamValue((storedParam as NodeParamWithChildren).childNodeIds[i], param[i])
        }
        return
      }
    })
  }
}
