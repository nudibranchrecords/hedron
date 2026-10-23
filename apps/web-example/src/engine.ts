import { EngineData, HedronEngine } from '@hedron-gl/engine'
import { ClockPlugin } from '@hedron-gl/clock'
import { LFOInput } from '@hedron-gl/lfo-input'
import projectData from './project.json'
import '@fontsource/chivo-mono'
import './style.css'
import { getSketchModuleItems } from './utils'

// Imported from the Hedron project save file (JSON)
const engineData = projectData.engine as unknown as EngineData

export const engine = new HedronEngine({
  rendererType: 'webgl',
  canvasSizeMode: 'fillContainer',
})

// Because the project uses LFOs, we need a clock
const clockPlugin = new ClockPlugin()
clockPlugin.clock.start()
engine.registerPlugin(clockPlugin)

// We need to add the plugin for LFOs to work
engine.registerPlugin(new LFOInput(engine, clockPlugin.clock))

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
// Plugins create their nodes (e.g. clock BPM) and sync with project state
engine.initiatePlugins()

// Add the canvas to the DOM
engine.createCanvas(document.getElementById('root') as HTMLElement)
