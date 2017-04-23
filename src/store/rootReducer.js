import { combineReducers } from 'redux'
import sketchesReducer from './sketches/reducer'
import projectReducer from './project/reducer'
import inputsReducer from './inputs/reducer'
import paramsReducer from './params/reducer'
import shotsReducer from './shots/reducer'
import midiReducer from './midi/reducer'
import clockReducer from './clock/reducer'
import availableModulesReducer from './availableModules/reducer'

const rootReducer = combineReducers({
  params: paramsReducer,
  availableModules: availableModulesReducer,
  sketches: sketchesReducer,
  project: projectReducer,
  inputs: inputsReducer,
  shots: shotsReducer,
  clock: clockReducer,
  midi: midiReducer
})

export default rootReducer
