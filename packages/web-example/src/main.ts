import { EngineData, HedronEngine } from '@hedron/engine'
import { Clock } from '@hedron/clock'
import { LFOInput } from '@hedron/lfo-input'
import projectData from './project.json'
import '@fontsource/chivo-mono'
import './style.css'
import { getSketchModuleItems } from './utils'

const engineData = projectData.engine as unknown as EngineData

const clock = new Clock()

clock.start()

const engine = new HedronEngine({
  rendererType: 'webgl',
  canvasSizeMode: 'fillContainer',
  clock,
})

engine.registerPlugin(new LFOInput(engine))

const engineStore = engine.getStore()
const { setSketchModuleItem, loadProject } = engineStore.getState()

engine.createCanvas(document.getElementById('root') as HTMLElement)

const sketchModules = getSketchModuleItems()

sketchModules.forEach(setSketchModuleItem)

engine.startStoreListener()
engine.run()
loadProject(engineData)
