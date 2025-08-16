import { Pass } from 'postprocessing'
import { listenToStore } from './storeListener'
import { RendererType, Result } from './types'
import { importSketchModule } from './importSketchModule'
import { IPlugin } from '@plugins/Plugin'
import { stripForSave } from '@utils/stripForSave'
import { Renderer } from '@world/Renderer'
import { SketchInstanceError, SketchManager } from '@world/SketchManager'
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
  private _onError: SketchInstanceError

  private extraTime: number = 0 // For time manipulation, e.g. for skipping frames
  public totalTime: number = 0 // Total time for the engine, used for resetting time

  constructor(params: {
    onFrameStart?: () => void
    onFrameEnd?: () => void
    onError?: SketchInstanceError
    rendererType: RendererType
  }) {
    this.rendererType = params.rendererType
    this.store = createEngineStore()

    this._onError = (sketchInstanceId, type) => {
      params.onError?.(sketchInstanceId, type)
      this.setIsSketchBroken(sketchInstanceId, true)
    }

    this.sketchManager = new SketchManager({ onError: this._onError })
    this.renderer = new Renderer({ rendererType: this.rendererType })
    this.scene = createDebugScene(this.renderer, this._onError)

    this.onFrameStart = params?.onFrameStart
    this.onFrameEnd = params?.onFrameEnd
  }

  private setIsSketchBroken(sketchInstanceId: string, isBroken: boolean) {
    this.store.getState().updateSketch(sketchInstanceId, { isBroken })
  }

  public registerPlugin(plugin: IPlugin) {
    this.plugins[plugin.id] = plugin
  }

  public async initiateSketchModules(sketchesUrl: string, moduleIds: string[]) {
    this.sketchesUrl = sketchesUrl

    for (const moduleId of moduleIds) {
      await this.addSketchModule(moduleId)
    }

    const { removeSketchFromScene } = this.sketchManager

    const addSketchToScene = (sketchInstanceId: string, moduleId: string) => {
      const modules = this.store.getState().sketchModules
      const module = modules[moduleId].module

      const sketchInstance = this.sketchManager.addSketchToScene(sketchInstanceId, module)

      if (sketchInstance) {
        this.setIsSketchBroken(sketchInstance.id, false)
      }

      this.renderer.passesNeedUpdate_webGPU = true
    }

    listenToStore(this.store, addSketchToScene, removeSketchFromScene)
  }

  public async addSketchModule(moduleId: string): Promise<Result<SketchModuleItem>> {
    if (!this.sketchesUrl) throw new Error('Sketches URL not ready')

    const result = await importSketchModule(this.sketchesUrl, moduleId)

    if (!result.success) {
      console.error(`Failed to import sketch module ${moduleId}:`, result.error)
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
      const sketchInstance = this.sketchManager.addSketchToScene(sketch.id, moduleItem.module)

      if (sketchInstance) {
        this.setIsSketchBroken(sketchInstance.id, false)
      }

      this.store.getState().updateSketchParams(sketch.id)
    }

    this.renderer.passesNeedUpdate_webGPU = true
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
   * @param engineScene The scene object to update and render.
   * @param deltaTime The time delta (in seconds) to advance this frame.
   */
  private advanceFrame(engineScene: EngineScene, deltaTime: number) {
    const state = this.store.getState()
    const sketchInstances =
      // TODO: When we have scenes, sketches should be added to the scene earlier on
      (engineScene.sketches = this.sketchManager!.getSketchInstances())

    if (this.renderer.rendererType === 'webgl') {
      engineScene.clearPasses()
    }

    Object.keys(state.sketches).forEach((sketchId) => {
      const paramValues = getSketchParamValues(state, sketchId)
      const instance = sketchInstances.get(sketchId)
      if (instance?.getPasses) {
        try {
          instance.getPasses(engineScene).forEach((pass: Pass) => {
            engineScene.addPass(pass)
          })
        } catch (error) {
          console.error(`Error getting passes for sketch ${sketchId}:`, error)
          this.sketchManager.removeSketchFromScene(sketchId)
          this.setIsSketchBroken(sketchId, true)
        }
      }
      try {
        instance?.update({ deltaFrame: 1, deltaTime, params: paramValues, scene: engineScene })
      } catch (error) {
        console.error(`Error updating sketch ${sketchId}:`, error)
        this.sketchManager.removeSketchFromScene(sketchId)
        this.setIsSketchBroken(sketchId, true)
      }
    })
    this.renderer.render(engineScene)
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
   * Public method to resize the renderer's canvas.
   */
  public resizeRenderer(width: number, height: number): void {
    this.renderer.resize(width, height)
  }

  /**
   * Public method to get the renderer's current size.
   */
  public getRendererSize(): { width: number; height: number } {
    return {
      width: this.renderer.getWidth(),
      height: this.renderer.getHeight(),
    }
  }

  /**
   * Render a sequence of frames at a fixed framerate.
   * Calls onFrame(dataUrl, frameIndex) after each frame.
   * Does not accumulate any frame data in memory.
   * @param frameCount Number of frames to render
   * @param fps Frames per second
   * @param onFrame Callback invoked with the frame's data URL and index after each frame
   * @param width Optional width to resize the renderer
   * @param height Optional height to resize the renderer
   */
  public async renderFramesSequence(
    frameCount: number,
    fps: number = 30,
    onFrame: (dataUrl: string, frameIndex: number | string) => Promise<void> | void,
    width?: number,
    height?: number,
  ): Promise<void> {
    this.paused = true

    // Store original size if resizing
    let originalSize: { width: number; height: number } | null = null
    if (width && height) {
      originalSize = this.getRendererSize()
      this.resizeRenderer(width, height)
    }

    const frameDuration = 1 / fps
    const padCount = frameCount.toString().length // Zero-pad index based on frame count

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

      const prefixedIndex = i.toString().padStart(padCount, '0') // Zero-pad index for consistency
      await onFrame(dataUrl, prefixedIndex)

      // Simulate fixed framerate by waiting if needed
      if (i < frameCount - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1))
      }
    }

    // Restore original size after rendering
    if (originalSize) {
      this.resizeRenderer(originalSize.width, originalSize.height)
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
