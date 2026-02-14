import { EngineData, HedronEngine } from '@hedron-gl/engine'
import { Clock } from '@hedron-gl/clock'
import { LFOInput } from '@hedron-gl/lfo-input'
import projectData from './project.json'
import '@fontsource/chivo-mono'
import './style.css'
import { getSketchModuleItems } from './utils'

// Imported from the Hedron project save file (JSON)
const engineData = projectData.engine as unknown as EngineData

// Because the project uses LFOs, we need a clock
const clock = new Clock()
clock.start()

// Initialize the engine with the clock
export const engine = new HedronEngine({
  rendererType: 'webgl',
  canvasSizeMode: 'fillContainer',
  clock,
})

// We need to add the plugin for LFOs to work
engine.registerPlugin(new LFOInput(engine))

export const engineStore = engine.getStore()
const { setSketchModuleItem, loadProject } = engineStore.getState()

// Load in the sketch modules using a utility function (uses vite glob)
// This could also be done manually with simple `import` statements
const sketchModules = getSketchModuleItems()

// Set each sketch loaded module in the engine store
sketchModules.forEach(setSketchModuleItem)

// Start the engine
engine.startStoreListener()
engine.run()
loadProject(engineData)

// Add the canvas to the DOM
engine.createCanvas(document.getElementById('root') as HTMLElement)
