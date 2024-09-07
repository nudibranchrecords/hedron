import { createHedronStore, HedronStore } from './store/store'
import { listenToStore } from './storeListener'
import { createDebugScene } from './world/debugScene'
import { Renderer } from './world/Renderer'
import SketchManager from './world/SketchManager'

export class HedronEngine {
  private renderer: Renderer
  private store: HedronStore
  private sketchesUrl: string | null = null
  private sketchManager: SketchManager | null = null

  constructor() {
    this.renderer = new Renderer()
    this.store = createHedronStore()
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

  run() {
    const debugScene = createDebugScene()

    const loop = (): void => {
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
