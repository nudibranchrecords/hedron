import { createEngineStore, EngineStore } from './store/engineStore'
import { getSketchesOfModuleId } from './store/selectors/getSketchesOfModuleId'
import { listenToStore } from './storeListener'
import { createDebugScene } from './world/debugScene'
import { Renderer } from './world/Renderer'
import { SketchManager } from './world/SketchManager'
import { importSketchModule } from './importSketchModule'
import { ProjectData } from './store/types'
import { stripForSave } from './utils/stripForSave'

export class HedronEngine {
  private renderer: Renderer
  private store: EngineStore
  private sketchesUrl: string | null = null
  private sketchManager: SketchManager

  constructor() {
    this.store = createEngineStore()
    this.sketchManager = new SketchManager()
    this.renderer = new Renderer()
  }

  public setSketchesUrl(sketchesUrl: string) {
    this.sketchesUrl = sketchesUrl

    const { removeSketchFromScene } = this.sketchManager

    const addSketchToScene = (sketchId: string, moduleId: string) => {
      const modules = this.store.getState().sketchModules
      const module = modules[moduleId].module
      this.sketchManager.addSketchToScene(sketchId, module)
    }

    listenToStore(this.store, addSketchToScene, removeSketchFromScene)
  }

  public async initiateSketchModules(moduleIds: string[]) {
    for (const moduleId of moduleIds) {
      await this.addSketchModule(moduleId)
    }

    this.store.setState({ isSketchModulesReady: true })
  }

  public async addSketchModule(moduleId: string) {
    if (!this.sketchesUrl) throw new Error('Sketches URL not ready')

    const moduleItem = await importSketchModule(this.sketchesUrl, moduleId)
    this.store.getState().setSketchModuleItem(moduleItem)

    return moduleItem
  }

  public removeSketchModule = async (moduleId: string): Promise<void> => {
    this.store.getState().deleteSketchModule(moduleId)
  }

  public async reimportSketchModuleAndReloadSketches(moduleId: string) {
    const moduleItem = await this.addSketchModule(moduleId)

    const sketchesToRefresh = getSketchesOfModuleId(this.store.getState(), moduleId)

    for (const sketch of sketchesToRefresh) {
      this.sketchManager.removeSketchFromScene(sketch.id)
      this.sketchManager.addSketchToScene(sketch.id, moduleItem.module)
      this.store.getState().updateSketchParams(sketch.id)
    }
  }

  public createCanvas(containerEl: HTMLDivElement) {
    return this.renderer.createCanvas(containerEl)
  }

  public setOutput(container: HTMLDivElement) {
    this.renderer.setOutput(container)
  }

  public stopOutput() {
    this.renderer.stopOutput()
  }

  public getStore() {
    return this.store
  }

  public getSaveData(): ProjectData {
    return stripForSave(this.store.getState())
  }

  run() {
    const debugScene = createDebugScene(this.renderer)

    const loop = (): void => {
      const { sketches, nodeValues, nodes } = this.store.getState()
      const sketchInstances = this.sketchManager!.getSketchInstances()
      debugScene.clearPasses()
      Object.values(sketches).forEach((sketch) => {
        // eslint-disable-next-line
        const paramValues: { [key: string]: any } = {}

        sketch.paramIds.forEach((id) => {
          const value = nodeValues[id]
          const paramKey = nodes[id].key
          paramValues[paramKey] = value
        })

        const instance = sketchInstances[sketch.id]

        if (instance.getPasses) {
          instance.getPasses(debugScene).forEach((pass) => {
            debugScene.addPass(pass)
          })
        }
        instance.update({ deltaFrame: 1, params: paramValues })
      })

      requestAnimationFrame(loop)
      if (debugScene) {
        this.renderer.render(debugScene)
      }
    }

    loop()
  }
}
