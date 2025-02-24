import { Midi } from '@hedron/midi'
import { listenToStore } from './storeListener'
import { Result } from './types'
import { importSketchModule } from './importSketchModule'
import { stripForSave } from '@utils/stripForSave'
import { Renderer } from '@world/Renderer'
import { SketchManager } from '@world/SketchManager'
import { createDebugScene } from '@world/debugScene'
import { EngineData, Input, SketchModuleItem } from '@store/types'
import { getSketchesOfModuleId } from '@store/selectors/getSketchesOfModuleId'
import { createEngineStore, EngineStore } from '@store/engineStore'
import { getSketchParamValues } from '@store/selectors/getSketchParamValues'

export class HedronEngine {
  private renderer: Renderer
  private store: EngineStore
  private sketchesUrl: string | null = null
  private sketchManager: SketchManager
  private midi: Midi

  constructor() {
    this.store = createEngineStore()
    this.sketchManager = new SketchManager()
    this.renderer = new Renderer()
    this.midi = new Midi()
    this.midi.onMidiMessage.add((event) => {
      this.store.getState().updateInputValues(event.id, (event.value || 0) / 127)
    }, this)
  }

  public async midiLearn(paramId: string): Promise<Input| undefined> {
    const event = await this.midi.midiLearn()
    if (!event) {
      console.log('MIDI learn canceled')
      return;
    }

    const id = event.id;
    let input = this.store.getState().inputs[id]
    if (!input) {
      input = {
        id,
        type: 'midi',
        targetNodeIds: [paramId],
      }
      this.store.getState().addInput(id, input)
      return input
    }
    this.store.getState().addInputParam(id, paramId)
    return input
  }

  public cancelMidiLearn() {
    this.midi.cancelMidiLearn()
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

  public getStore() {
    return this.store
  }

  public getSaveData(): EngineData {
    return stripForSave(this.store.getState())
  }

  public deleteInputParam(inputId: string, nodeId: string) {
    this.store.getState().deleteInputParam(inputId, nodeId)
  }

  run() {
    const debugScene = createDebugScene(this.renderer)

    const loop = (): void => {
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
