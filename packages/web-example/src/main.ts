import { EngineData, HedronEngine, processConfig } from '@hedron/engine'
import module from './sketches/solid'
import config from './sketches/solid/config'
import projectData from './project.json'

import './style.css'

const engineData = projectData.engine as unknown as EngineData

const engine = new HedronEngine({
  rendererType: 'webgl',
  canvasSizeMode: 'fillContainer',
})

const engineStore = engine.getStore()
const { setSketchModuleItem, loadProject } = engineStore.getState()

engine.createCanvas(document.getElementById('root') as HTMLElement)

const moduleItem = {
  moduleId: 'solid',
  config: processConfig(config, { fallBackTitle: 'Solid' }),
  module,
}

setSketchModuleItem(moduleItem)
engine.initiateSketchModules()
engine.run()
loadProject(engineData)
