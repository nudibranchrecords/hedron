import { uid } from 'uid'
import { EngineStore } from '../store/engineStore'
import { SketchConfig, SketchModule, SketchModules } from '../store/types'
import { getDebugScene } from './debugScene'

type SketchInstance = {
  // eslint-disable-next-line -- TODO: Type this!
  update: any
  // eslint-disable-next-line
  root: any
}

class SketchManager {
  private sketchInstances: { [id: string]: SketchInstance } = {}
  private sketchesUrl: string
  private store: EngineStore

  constructor(sketchesUrl: string, store: EngineStore) {
    this.sketchesUrl = sketchesUrl
    this.store = store
  }

  private createSketch = (instanceId: string, moduleId: string): SketchInstance => {
    const base = this.sketchesUrl
    const modules = this.store.getState().sketchModules
    const module = modules[moduleId].module

    const sketch = new module({ sketchesDir: base })
    sketch.root.name = instanceId

    this.sketchInstances[instanceId] = sketch

    return sketch
  }

  public addSketchToScene = (instanceId: string, moduleId: string): void => {
    const scene = getDebugScene().scene
    const sketch = this.createSketch(instanceId, moduleId)

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

  private importSketch = async (
    moduleId: string,
  ): Promise<{ config: SketchConfig; module: SketchModule }> => {
    const base = this.sketchesUrl
    const cacheBust = uid()

    const configModule = await import(
      /* @vite-ignore */ `${base}/${moduleId}/config.js?${cacheBust}`
    )
    const sketchModule = await import(
      /* @vite-ignore */ `${base}/${moduleId}/index.js?${cacheBust}`
    )

    return {
      config: configModule.default,
      module: sketchModule.default,
    }
  }

  public initiateSketchModules = (moduleIds: string[]): void => {
    const getSketchInfo = async (): Promise<void> => {
      const modules: SketchModules = {}
      for (const moduleId of moduleIds) {
        const { config, module } = await this.importSketch(moduleId)

        const title = config.title

        modules[moduleId] = {
          moduleId,
          title,
          module,
          config,
        }
      }

      this.store.setState({ sketchModules: modules })
      this.store.setState({ isSketchModulesReady: true })
    }

    getSketchInfo()
  }

  public reimportSketchModule = async (moduleId: string): Promise<void> => {
    const { config, module } = await this.importSketch(moduleId)

    const title = config.title

    const item = {
      moduleId,
      title,
      module,
      config,
    }

    this.store.getState().setSketchModuleItem(item)
  }

  public getSketchInstances = () => {
    return this.sketchInstances
  }
}

export default SketchManager
