import { createEngineStore, EngineStore } from './store/engineStore'
import { getSketchesOfModuleId } from './store/selectors/getSketchesOfModuleId'
import { listenToStore } from './storeListener'
import { createDebugScene } from './world/debugScene'
import { Renderer } from './world/Renderer'
import { SketchManager } from './world/SketchManager'
import { importSketchModule } from './importModule'

export class HedronEngine {
  private renderer: Renderer
  private store: EngineStore
  private sketchesUrl: string | null = null
  private sketchManager: SketchManager | null = null

  constructor() {
    this.renderer = new Renderer()
    this.store = createEngineStore()
  }

  public setSketchesUrl(sketchesUrl: string) {
    this.sketchesUrl = sketchesUrl
    this.sketchManager = new SketchManager()

    const { removeSketchFromScene } = this.sketchManager

    listenToStore(this.store, this.addSketchToScene, removeSketchFromScene)
  }

  public async initiateSketchModules(moduleIds: string[]) {
    for (const moduleId of moduleIds) {
      await this.addSketchModule(moduleId)
    }

    this.store.setState({ isSketchModulesReady: true })
  }

  addSketchToScene = (sketchId: string, moduleId: string) => {
    if (!this.sketchManager) throw new Error('Sketch Manager not ready')

    const modules = this.store.getState().sketchModules
    const module = modules[moduleId].module
    this.sketchManager.addSketchToScene(sketchId, module)
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
    if (!this.sketchManager) throw new Error('Sketch Manager not ready')

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

  run() {
    if (!this.sketchManager) throw new Error('Sketch Manager not ready')

    const debugScene = createDebugScene()

    const loop = (): void => {
      const { sketches, nodeValues, nodes } = this.store.getState()
      const sketchInstances = this.sketchManager!.getSketchInstances()

      Object.values(sketches).forEach((sketch) => {
        // eslint-disable-next-line
        const paramValues: { [key: string]: any } = {}

        sketch.paramIds.forEach((id) => {
          const value = nodeValues[id]
          const paramKey = nodes[id].key
          paramValues[paramKey] = value
        })

        sketchInstances[sketch.id].update({ deltaFrame: 1, params: paramValues })
      })

      requestAnimationFrame(loop)
      if (debugScene) {
        this.renderer.render(debugScene)
      }
    }

    loop()
  }

  public getStore() {
    return this.store
  }
}
