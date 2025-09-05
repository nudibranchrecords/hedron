import { EngineData, HedronEngine } from '@hedron/engine'
import projectData from './project.json'
import '@fontsource/chivo-mono'
import './style.css'
import { getSketchModuleItems } from './utils'

const engineData = projectData.engine as unknown as EngineData

const engine = new HedronEngine({
  rendererType: 'webgl',
  canvasSizeMode: 'fillContainer',
})

const engineStore = engine.getStore()
const { setSketchModuleItem, loadProject } = engineStore.getState()

engine.createCanvas(document.getElementById('root') as HTMLElement)

const sketchModules = getSketchModuleItems()

sketchModules.forEach(setSketchModuleItem)

engine.startStoreListener()
engine.run()
loadProject(engineData)
