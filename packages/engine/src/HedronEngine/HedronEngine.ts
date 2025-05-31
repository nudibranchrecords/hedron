import { listenToStore } from './storeListener'
import { Result } from './types'
import { importSketchModule } from './importSketchModule'
import { IPlugin } from '@plugins/Plugin'
import { stripForSave } from '@utils/stripForSave'
import { Renderer } from '@world/Renderer'
import { SketchManager } from '@world/SketchManager'
import { createDebugScene } from '@world/debugScene'
import { EngineData, SketchModuleItem } from '@store/types'
import { getSketchesOfModuleId } from '@store/selectors/getSketchesOfModuleId'
import { createEngineStore, EngineStore } from '@store/engineStore'
import { getSketchParamValues } from '@store/selectors/getSketchParamValues'

export class HedronEngine {
  private renderer: Renderer
  private store: EngineStore
  private sketchesUrl: string | null = null
  private sketchManager: SketchManager
  public plugins: Record<string, IPlugin> = {}
  private onFrameStart?: () => void
  private onFrameEnd?: () => void
  private running: boolean = false
  private paused: boolean = false

  constructor(params?: { onFrameStart?: () => void; onFrameEnd?: () => void }) {
    this.store = createEngineStore()
    this.sketchManager = new SketchManager()
    this.renderer = new Renderer()

    this.onFrameStart = params?.onFrameStart
    this.onFrameEnd = params?.onFrameEnd
  }

  public registerPlugin(plugin: IPlugin) {
    this.plugins[plugin.id] = plugin
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

  public async addSketchModule(moduleId: string): Promise<Result<SketchModuleItem>> {
    if (!this.sketchesUrl) throw new Error('Sketches URL not ready')

    const result = await importSketchModule(this.sketchesUrl, moduleId)

    if (!result.success) {
      // TODO: Show UI error here (engine needs to have some "error" state slice)
      return result
    }

    const moduleItem = result.data
    this.store.getState().setSketchModuleItem(moduleItem)

    return result
  }

  public removeSketchModule = async (moduleId: string): Promise<void> => {
    this.store.getState().deleteSketchModule(moduleId)
  }

  public async reimportSketchModuleAndReloadSketches(moduleId: string): Promise<void> {
    const result = await this.addSketchModule(moduleId)

    if (!result.success) {
      return
    }

    const moduleItem = result.data

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

  public captureFrame(): string | null {
    return this.renderer.captureFrame()
  }

  public getStore() {
    return this.store
  }

  public getSaveData(): EngineData {
    return stripForSave(this.store.getState())
  }

  run() {
    if (this.running) return
    this.running = true
    this.paused = false

    const debugScene = createDebugScene(this.renderer)
    let lastTime = performance.now()

    const loop = (): void => {
      if (!this.running || this.paused) {
        requestAnimationFrame(loop)
        return
      }

      this.onFrameStart?.()

      const now = performance.now()
      const deltaTime = (now - lastTime) / 1000
      lastTime = now

      const state = this.store.getState()
      const sketchInstances = this.sketchManager!.getSketchInstances()
      debugScene.clearPasses()

      Object.keys(state.sketches).forEach((sketchId) => {
        const paramValues = getSketchParamValues(state, sketchId)
        const instance = sketchInstances[sketchId]
        if (instance.getPasses) {
          instance.getPasses(debugScene).forEach((pass) => {
            debugScene.addPass(pass)
          })
        }
        instance.update({ deltaFrame: 1, deltaTime, params: paramValues })
      })

      requestAnimationFrame(loop)
      if (debugScene) {
        this.renderer.render(debugScene)
      }

      this.onFrameEnd?.()
    }

    loop()
  }

  public pause() {
    this.paused = true
  }

  public resume() {
    if (!this.running) {
      this.run()
    } else {
      this.paused = false
      this.run()
    }
  }

  public stop() {
    this.running = false
    this.paused = false
  }

  /**
   * Render a sequence of frames at a fixed framerate.
   * Calls onFrame(dataUrl, frameIndex) after each frame.
   * Does not accumulate any frame data in memory.
   */
  public async renderFramesSequence(
    frameCount: number,
    fps: number = 30,
    onFrame: (dataUrl: string, frameIndex: number) => Promise<void> | void,
  ): Promise<void> {
    this.paused = true

    const debugScene = createDebugScene(this.renderer)
    const state = this.store.getState()
    const sketchInstances = this.sketchManager!.getSketchInstances()
    const frameDuration = 1 / fps

    for (let i = 0; i < frameCount; i++) {
      this.onFrameStart?.()

      const deltaTime = frameDuration

      debugScene.clearPasses()
      Object.keys(state.sketches).forEach((sketchId) => {
        const paramValues = getSketchParamValues(state, sketchId)
        const instance = sketchInstances[sketchId]
        if (instance.getPasses) {
          instance.getPasses(debugScene).forEach((pass) => {
            debugScene.addPass(pass)
          })
        }
        instance.update({ deltaFrame: 1, deltaTime, params: paramValues })
      })

      this.renderer.render(debugScene)
      this.onFrameEnd?.()

      const dataUrl = this.captureFrame()
      if (!dataUrl) throw new Error(`Failed to capture frame at index ${i}`)

      await onFrame(dataUrl, i)

      // Simulate fixed framerate by waiting if needed
      if (i < frameCount - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1))
      }
    }

    this.paused = false
  }
}
