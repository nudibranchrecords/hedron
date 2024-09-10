import { createEngineStore, EngineStore } from './store/engineStore'
import { listenToStore } from './storeListener'
import { createDebugScene } from './world/debugScene'
import { Renderer } from './world/Renderer'
import SketchManager from './world/SketchManager'

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
    this.sketchManager = new SketchManager(this.sketchesUrl, this.store)

    const { addSketchToScene, removeSketchFromScene } = this.sketchManager

    listenToStore(this.store, addSketchToScene, removeSketchFromScene)
  }

  public initiateSketchModules(moduleIds: string[]) {
    if (!this.sketchManager) throw new Error('Sketch Manager not ready')

    this.sketchManager.initiateSketchModules(moduleIds)
  }

  public reimportSketchModule(moduleId: string) {
    if (!this.sketchManager) throw new Error('Sketch Manager not ready')

    this.sketchManager.reimportSketchModule(moduleId)
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
