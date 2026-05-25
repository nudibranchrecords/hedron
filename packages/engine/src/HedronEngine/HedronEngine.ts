import { Pass } from 'postprocessing'
import { type Clock } from '@hedron-gl/clock'
import { listenToStore } from './storeListener'
import { CanvasSizeMode, RendererType, Result, ShotArgsObject } from './types'
import { importSketchModule } from './importSketchModule'
import { addResource, removeResource } from '@store/actions/resources'
import { createUniqueId } from '@utils/createUniqueId'
import { ensureNodeConfig } from '@store/shared/ensureConfig'
import { flushParamValueBuffer } from '@store/actionCreators/updateParamValue'
import { getSketchShotNodes } from '@store/selectors/getSketchShotNodes'
import { initializeGlobalVars } from '@globalVars'
import { IPlugin } from '@plugins/Plugin'
import { stripForSave } from '@utils/stripForSave'
import { Renderer } from '@world/Renderer'
import { SketchManager } from '@world/SketchManager'
import { createDebugScene } from '@world/debugScene'
import {
  EngineData,
  Node,
  ParamValue,
  SketchInstanceError,
  SketchInstance,
  SketchModuleItem,
  Param,
  Shot,
  ConfigParam,
  ConfigShot,
  ConfigCustomNode,
  ChildGroupsLoose,
  Resources,
} from '@store/types'
import { getSketchesOfModuleId } from '@store/selectors/getSketchesOfModuleId'
import { createEngineStore, EngineStore } from '@store/engineStore'
import { getSketchParamValues } from '@store/selectors/getSketchParamValues'
import { EngineScene } from '@world/EngineScene'
import { addNode } from '@store/shared/addNode'

export class HedronEngine {
  public rendererType: RendererType
  private renderer: Renderer
  private store: EngineStore
  private sketchesUrl: string | null = null
  private sketchManager: SketchManager
  public plugins: Record<string, IPlugin> = {}
  private registeredShots: Record<string, (args: ShotArgsObject) => void> = {}
  private shotListeners: Record<string, (() => void)[]> = {}
  private onFrameStart?: () => void
  private onFrameEnd?: () => void
  public clock?: Clock
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
    canvasSizeMode: CanvasSizeMode
    clock?: Clock
  }) {
    // Initialize global variables for sketches
    initializeGlobalVars()

    this.rendererType = params.rendererType
    this.store = createEngineStore()

    this._onError = (sketchInstanceId, type) => {
      params.onError?.(sketchInstanceId, type)
      this.setIsSketchBroken(sketchInstanceId, true)
    }

    this.sketchManager = new SketchManager({ onError: this._onError })
    this.renderer = new Renderer({
      rendererType: this.rendererType,
      canvasSizeMode: params.canvasSizeMode,
    })
    this.scene = createDebugScene(this.renderer, this._onError)

    this.onFrameStart = params?.onFrameStart
    this.onFrameEnd = params?.onFrameEnd

    if (params.clock) {
      this.clock = params.clock
    }
  }

  private setIsSketchBroken(sketchInstanceId: string, isBroken: boolean) {
    this.store.getState().updateSketch(sketchInstanceId, { isBroken })
  }

  /**
   * Creates global option nodes for a plugin in the store
   * @param plugin The plugin to create global option nodes for
   */
  private createGlobalOptionNodesForPlugin(plugin: IPlugin): void {
    // Only process plugins with global options
    if (!plugin.globalOptionNodesConfig) return

    // Create option nodes in the store
    this.store.setState((state) => {
      for (const cfg of plugin.globalOptionNodesConfig || []) {
        const nodeId = `${plugin.id}-global-${cfg.key}`

        // Only create the node if it doesn't already exist
        if (state.nodes[nodeId]) {
          continue
        }

        // Create proper imported config with required fields
        const cfgImported = ensureNodeConfig(cfg)

        // Add the node to the store using the shared addNode utility
        addNode(state, nodeId, null, cfgImported)
      }
    })
  }

  public registerPlugin(plugin: IPlugin) {
    this.plugins[plugin.id] = plugin
    // Make plugins available in the global window object for debugging
    window.__HEDRON = window.__HEDRON || {}
    window.__HEDRON.plugins = this.plugins
  }

  public addNode(
    nodeId: string,
    parentId: string | null,
    config: ConfigParam | ConfigShot | ConfigCustomNode,
  ) {
    this.store.setState((state) => {
      addNode(state, nodeId, parentId, ensureNodeConfig(config))
    })
  }

  public addNodeOnce(
    nodeId: string,
    parentId: string | null,
    config: ConfigParam | ConfigShot | ConfigCustomNode,
  ) {
    if (this.store.getState().nodes[nodeId]) return
    this.addNode(nodeId, parentId, config)
  }

  public addOptionNodes(parentId: string, configs: readonly (ConfigParam | ConfigShot)[]) {
    this.store.setState((state) => {
      const parentNode = state.nodes[parentId]

      if (!parentNode) {
        console.error(`addOptionNodes: node "${parentId}" not found`)
        return
      }

      for (const cfg of configs) {
        const optionNodeExists = parentNode.childGroups.optionNodeIds.some((id) => {
          const node = state.nodes[id] as Param | Shot | undefined
          return node?.key === cfg.key
        })

        if (optionNodeExists) continue

        const nodeId = createUniqueId()
        addNode(state, nodeId, parentId, ensureNodeConfig(cfg))
        parentNode.childGroups.optionNodeIds.push(nodeId)
      }
    })
  }

  public setNodeCustomData(nodeId: string, customData: Record<string, unknown>) {
    this.store.setState((state) => {
      const node = state.nodes[nodeId]
      if (!node) {
        console.error(`setNodeCustomData: node "${nodeId}" not found`)
        return
      }

      node.customData = {
        ...node.customData,
        ...customData,
      }
    })
  }

  /** Adds `parentId` to `childId.parentIds` and appends `childId` to the given `childGroupKey` on the parent. */
  public addChildToNode(parentId: string, childGroupKey: string, childId: string) {
    this.store.setState((state) => {
      const childNode = state.nodes[childId]
      const parentNode = state.nodes[parentId]

      if (!childNode) {
        console.error(`addChildToNode: node "${childId}" not found`)
        return
      }

      if (!parentNode) {
        console.error(`addChildToNode: parent node "${parentId}" not found`)
        return
      }

      const childGroups = parentNode.childGroups as ChildGroupsLoose

      let childGroup = childGroups[childGroupKey]
      if (!childGroup) {
        childGroup = childGroups[childGroupKey] = []
      }

      if (!childNode.parentIds.includes(parentId)) {
        childNode.parentIds.push(parentId)
      }

      if (!childGroup.includes(childId)) {
        childGroup.push(childId)
      }
    })
  }

  public setResources(resources: Resources) {
    this.store.setState(() => ({
      resources,
    }))
  }

  public setResourcesUrl(resourcesUrl: string | null) {
    this.store.setState(() => ({
      resourcesUrl,
    }))
  }

  public addResource(fileName: string, contentType: string, lastModified: number = Date.now()) {
    this.store.setState((state) => {
      addResource(state, fileName, contentType, lastModified)
    })
  }

  public removeResource(fileName: string) {
    this.store.setState((state) => {
      removeResource(state, fileName)
    })
  }

  public getNode<T extends Node = Node>(nodeId: string): T | undefined {
    return this.store.getState().nodes[nodeId] as T | undefined
  }

  public getParamValue(nodeId: string): ParamValue | undefined {
    return this.store.getState().paramValues[nodeId]
  }

  public setParamValue(nodeId: string | undefined, value: ParamValue): void {
    if (!nodeId) {
      console.error('setParamValue: nodeId is undefined')
      return
    }
    this.store.getState().updateParamValue(nodeId, value)
  }

  public addInput(inputType: string, targetNodeId: string) {
    const plugin = Object.values(this.plugins).find((p) => p.inputType === inputType)

    if (!plugin) {
      console.error(`No plugin found for input type ${inputType}`)
      return
    }

    const state = this.store.getState()

    const targetNode = state.nodes[targetNodeId]

    const numAlready = targetNode?.childGroups?.inputNodeIds?.length ?? 0

    const input = {
      inputType: plugin.inputType,
      targetNodeId,
      title: `${plugin.inputType} ${numAlready + 1}`,
      parentIds: [targetNodeId],
    }

    const addInput = this.store.getState().addInput

    const inputId = addInput(input)

    /**
     * FIXME: Once `optionNodesConfig` is removed, we wont need this
     * All plugins will use `onNewInput` to add these manually
     * */
    this.addOptionNodes(inputId, plugin.optionNodesConfig ?? [])

    plugin.onNewInput?.(this, inputId)

    return inputId
  }

  /**
   * Get the node IDs for a plugin's global option nodes
   * @param pluginId The ID of the plugin
   * @param includeHidden Whether to include hidden nodes (default: false)
   * @returns An array of node IDs for the global options
   */
  public getPluginGlobalOptionNodeIds(pluginId: string, includeHidden: boolean = false): string[] {
    const plugin = this.plugins[pluginId]
    if (!plugin || !plugin.globalOptionNodesConfig) return []

    let nodes = [...plugin.globalOptionNodesConfig]
    if (!includeHidden) {
      nodes = nodes.filter((cfg) => !cfg.hidden)
    }
    // The IDs of global option nodes follow the pattern: `${pluginId}-global-${optionKey}`
    return nodes.map((config) => `${pluginId}-global-${config.key}`)
  }

  public registerShot(shotId: string, shotFunc: (value: ShotArgsObject) => void) {
    this.unregisterShot(shotId) // Unregister existing shot if it exists to avoid duplicates
    this.registeredShots[shotId] = shotFunc
  }

  // This method is private, because we're automatically unregistering shots when nodes are removed from the store
  private unregisterShot(shotId: string) {
    delete this.registeredShots[shotId]
  }

  private registerAllSketchShots(sketchId: string, sketchInstance: SketchInstance) {
    const shotNodes = getSketchShotNodes(this.store.getState(), sketchId)

    shotNodes.forEach((shotNode) => {
      this.registerShot(shotNode.id, (shotArgs) => {
        const state = this.store.getState()
        const params = getSketchParamValues(state, sketchId, {
          resourcesUrl: state.resourcesUrl,
        })

        sketchInstance?.[shotNode.key]?.({
          params,
          scene: this.scene,
          shotArgs,
        })
      })
    })
  }

  /**
   * Registers a shot listener, which fires whenever a shot has just fired. Useful for UI to respond to shots being fired (e.g. blinking a trigger pad).
   * Returns an unsubscribe function to remove the listener
   */
  public registerShotListener(shotId: string, listener: () => void) {
    if (!this.shotListeners[shotId]) {
      this.shotListeners[shotId] = []
    }
    this.shotListeners[shotId].push(listener)

    return () => {
      this.shotListeners[shotId] = this.shotListeners[shotId].filter((l) => l !== listener)
    }
  }

  public fireShot(shotId: string, shotArgs?: ShotArgsObject) {
    this.registeredShots[shotId]?.(shotArgs ?? {})
    this.shotListeners[shotId]?.forEach((listener) => listener())
  }

  /**
   * Sets up listeners to the engine store to handle adding/removing sketches from the scene and registering shots.
   * Should be called after setting sketch modules (e.g. importSketchModulesFromIds or manually with setSketchModuleItem)
   */
  public startStoreListener() {
    const addSketchToScene = (sketchInstanceId: string, moduleId: string) => {
      try {
        const storeState = this.store.getState()
        const modules = storeState.sketchModules
        const module = modules[moduleId].module

        const sketchInstance = this.sketchManager.addSketchToScene(sketchInstanceId, module)

        if (sketchInstance) {
          this.registerAllSketchShots(sketchInstanceId, sketchInstance)
          this.setIsSketchBroken(sketchInstance.id, false)
        }

        this.renderer.passesNeedUpdate_webGPU = true
      } catch (error) {
        console.error('Error adding sketch to scene:', error)
        console.error(
          `Failed to add sketch ${sketchInstanceId} of module ${moduleId} to scene. Is the module in your sketch folder? Web projects: Have you imported the module?`,
        )
        this.setIsSketchBroken(sketchInstanceId, true)
      }
    }

    const removeSketchFromScene = (sketchInstanceId: string) => {
      this.sketchManager.removeSketchFromScene(sketchInstanceId)
      this.renderer.passesNeedUpdate_webGPU = true
    }

    const reorderSketchesInScene = (sketchInstanceIds: string[]) => {
      this.sketchManager.reorderSketchesInScene(sketchInstanceIds)
      this.renderer.passesNeedUpdate_webGPU = true
    }

    const handleRemovedNode = (nodeId: string) => {
      this.unregisterShot(nodeId)
    }

    listenToStore({
      store: this.store,
      onSketchAdded: addSketchToScene,
      onSketchRemoved: removeSketchFromScene,
      onNodeRemoved: handleRemovedNode,
      onSketchesReordered: reorderSketchesInScene,
    })
  }

  public async importSketchModulesFromIds(sketchesUrl: string, moduleIds: string[]) {
    this.sketchesUrl = sketchesUrl

    for (const moduleId of moduleIds) {
      await this.importSketchModule(moduleId)
    }
  }

  public async importSketchModule(moduleId: string): Promise<Result<SketchModuleItem>> {
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
    const result = await this.importSketchModule(moduleId)

    if (!result.success) {
      return
    }

    const moduleItem = result.data
    const sketchesToRefresh = getSketchesOfModuleId(this.store.getState(), moduleId)

    for (const sketch of sketchesToRefresh) {
      this.sketchManager.removeSketchFromScene(sketch.id)
      const sketchInstance = this.sketchManager.addSketchToScene(sketch.id, moduleItem.module)

      if (sketchInstance) {
        this.registerAllSketchShots(sketch.id, sketchInstance)
        this.setIsSketchBroken(sketchInstance.id, false)
      }

      this.store.getState().reconcileSketchNodes(sketch.id)
    }

    this.renderer.passesNeedUpdate_webGPU = true
  }

  public subscribeToParamValue(nodeId: string, callback: (value: ParamValue | undefined) => void) {
    return this.store.subscribe((state) => state.paramValues[nodeId], callback)
  }

  /**
   * Reconciles all sketches in the engine store to ensure their nodes match their module configurations (e.g. add/remove params and shots).
   * Useful after loading a project.
   */
  public async reconcileAllSketchNodes(): Promise<void> {
    const state = this.store.getState()
    const sketchesToReconcile = Object.values(state.sketches)

    for (const sketch of sketchesToReconcile) {
      state.reconcileSketchNodes(sketch.id)
    }
  }

  /**
   * Creates a canvas element for the engine and attaches it to the specified container.
   * @param containerEl The HTML element to contain the engine's canvas.
   */
  public createCanvas(containerEl: HTMLElement) {
    return this.renderer.createCanvas(containerEl)
  }

  public setOutput(container: HTMLElement) {
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
   * @deprecated - Plugins should be using onEngineInitialize
   * Ensures global option nodes exist for all registered plugins
   * This should be called when the engine is ready to use plugin global options
   */
  public ensureGlobalOptionNodes() {
    // For each registered plugin, ensure global option nodes exist
    Object.values(this.plugins).forEach((plugin) => {
      this.createGlobalOptionNodesForPlugin(plugin)
    })
  }

  public initiatePlugins() {
    Object.values(this.plugins).forEach((plugin) => {
      plugin.onEngineInitialize?.(this)
    })
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
    // Flush buffered node value updates before processing the frame
    flushParamValueBuffer(this.store.setState)

    const state = this.store.getState()
    const sketchInstances =
      // TODO: When we have scenes, sketches should be added to the scene earlier on
      (engineScene.sketches = this.sketchManager!.getSketchInstances())

    if (this.renderer.rendererType === 'webgl') {
      engineScene.clearPasses()
    }

    Object.keys(state.sketches).forEach((sketchId) => {
      const paramValues = getSketchParamValues(state, sketchId, {
        resourcesUrl: state.resourcesUrl,
      })
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

  /**
   * Retrieves a registered plugin by its ID.
   * @param id The ID of the plugin to retrieve
   * @returns The plugin if it has been registered, undefined otherwise
   */
  public getPlugin<T extends IPlugin>(id: string): T | undefined {
    return this.plugins[id] as T | undefined
  }
}
