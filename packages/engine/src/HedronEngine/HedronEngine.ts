import { Pass } from 'postprocessing'
import { type ShaderNodeObject } from 'three/tsl'
import { PassNode } from 'three/webgpu'
import { listenToStore } from './storeListener'
import { RendererType, Result } from './types'
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
import { EngineScene } from '@world/EngineScene'

export class HedronEngine {
  public rendererType: RendererType
  private renderer: Renderer
  private store: EngineStore
  private sketchesUrl: string | null = null
  private sketchManager: SketchManager
  public plugins: Record<string, IPlugin> = {}
  private onFrameStart?: () => void
  private onFrameEnd?: () => void
  private running: boolean = false
  private paused: boolean = false
  private scene: EngineScene // The main scene for rendering sketches

  private extraTime: number = 0 // For time manipulation, e.g. for skipping frames
  private totalTime: number = 0 // Total time for the engine, used for resetting time

  constructor(params: {
    onFrameStart?: () => void
    onFrameEnd?: () => void
    rendererType: RendererType
  }) {
    this.rendererType = params.rendererType
    this.store = createEngineStore()
    this.sketchManager = new SketchManager()
    this.renderer = new Renderer({ rendererType: this.rendererType })
    this.scene = createDebugScene(this.renderer)

    this.onFrameStart = params?.onFrameStart
    this.onFrameEnd = params?.onFrameEnd

    this.renderer.setMainSceneWebGPUPass(this.scene.scene, this.scene.camera)
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
      const sketch = this.sketchManager.addSketchToScene(sketchId, module)

      this.renderer.handleWebGPUPass(sketch)
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

    this.renderer.clearWebGPUPasses()

    for (const sketch of sketchesToRefresh) {
      this.sketchManager.removeSketchFromScene(sketch.id)
      const sketchInstance = this.sketchManager.addSketchToScene(sketch.id, moduleItem.module)
      this.renderer.handleWebGPUPass(sketchInstance)
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

  /**
   * Pauses the engine's main render loop.
   */
  public pause() {
    this.paused = true
  }

  /**
   * Resumes the engine's main render loop. If the engine is not running, starts it.
   */
  public resume() {
    if (!this.running) {
      this.run()
    } else {
      this.paused = false
      this.run()
    }
  }

  /**
   * Stops the engine's main render loop and resets running/paused state.
   */
  public stop() {
    this.running = false
    this.paused = false
  }

  /**
   * Advances the engine state by one frame, updating all sketches and rendering the scene.
   * Shared by both the real-time loop and fixed-framerate sequence rendering.
   * @param debugScene The debug scene object to update and render.
   * @param deltaTime The time delta (in seconds) to advance this frame.
   */
  private advanceFrame(debugScene: EngineScene, deltaTime: number) {
    const state = this.store.getState()
    const sketchInstances = this.sketchManager!.getSketchInstances()
    debugScene.clearPasses()
    Object.keys(state.sketches).forEach((sketchId) => {
      const paramValues = getSketchParamValues(state, sketchId)
      const instance = sketchInstances[sketchId]
      if (instance.getPasses) {
        instance.getPasses(debugScene).forEach((pass: Pass) => {
          debugScene.addPass(pass)
        })
      }
      instance.update({ deltaFrame: 1, deltaTime, params: paramValues, scene: debugScene })
    })
    this.renderer.render(debugScene)
  }

  /**
   * Starts the engine's main real-time render loop.
   * This loop runs at the browser's refresh rate using requestAnimationFrame.
   */
  public run() {
    if (this.running) return
    this.running = true
    this.paused = false

    let lastTime = performance.now()

    const loop = (): void => {
      if (!this.running) {
        return
      }

      if (this.paused) {
        requestAnimationFrame(loop)
        return
      }

      this.onFrameStart?.()

      const now = performance.now()
      let deltaTime = (now - lastTime) / 1000
      if (this.extraTime != 0) {
        deltaTime += this.extraTime
        this.extraTime = 0
      }
      this.totalTime += deltaTime
      lastTime = now

      this.advanceFrame(this.scene, deltaTime)

      requestAnimationFrame(loop)
      this.onFrameEnd?.()
    }

    loop()
  }

  /**
   * Render a sequence of frames at a fixed framerate.
   * Calls onFrame(dataUrl, frameIndex) after each frame.
   * Does not accumulate any frame data in memory.
   * @param frameCount Number of frames to render
   * @param fps Frames per second
   * @param onFrame Callback invoked with the frame's data URL and index after each frame
   */
  public async renderFramesSequence(
    frameCount: number,
    fps: number = 30,
    onFrame: (dataUrl: string, frameIndex: number) => Promise<void> | void,
  ): Promise<void> {
    this.paused = true

    const frameDuration = 1 / fps

    for (let i = 0; i < frameCount; i++) {
      this.onFrameStart?.()

      let deltaTime = frameDuration
      if (this.extraTime != 0) {
        deltaTime += this.extraTime
        this.extraTime = 0
      }
      this.totalTime += deltaTime

      this.advanceFrame(this.scene, deltaTime)
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

  /**
   * Adds or subtracts time from the engine's timeline, used for time manipulation.
   * @param seconds Number of seconds to jump forward (positive) or backward (negative)
   */
  public jumpTime(seconds: number): void {
    this.extraTime += seconds
  }

  /**
   * Resets the engine's timeline to zero.
   */
  public resetTime(): void {
    this.extraTime -= this.totalTime
    console.log(`Resetting time, extraTime: ${this.extraTime}, totalTime: ${this.totalTime}`)
  }
}
