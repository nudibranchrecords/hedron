import { combineReducers } from 'redux'
import sketchesReducer from './sketches/reducer'
import projectReducer from './project/reducer'
import inputsReducer from './inputs/reducer'

const rootReducer = combineReducers({
  sketches: sketchesReducer,
  project: projectReducer,
  inputs: inputsReducer
})

export default rootReducer
