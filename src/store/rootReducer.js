import { combineReducers } from 'redux'
import sketchesReducer from './sketches/reducer'
import projectReducer from './project/reducer'

const rootReducer = combineReducers({
  sketches: sketchesReducer,
  project: projectReducer
})

export default rootReducer
