import { combineReducers } from 'redux'
import sketchesReducer from './sketches/reducer'
import projectReducer from './project/reducer'
import inputsReducer from './inputs/reducer'
import nodesReducer from './nodes/reducer'
import inputLinkReducer from './inputLinks/reducer'
import midiReducer from './midi/reducer'
import clockReducer from './clock/reducer'
import availableModulesReducer from './availableModules/reducer'
import displaysReducer from './displays/reducer'

const rootReducer = combineReducers({
  nodes: nodesReducer,
  availableModules: availableModulesReducer,
  sketches: sketchesReducer,
  project: projectReducer,
  inputs: inputsReducer,
  inputLinks: inputLinkReducer,
  clock: clockReducer,
  midi: midiReducer,
  displays: displaysReducer
})

export default rootReducer
