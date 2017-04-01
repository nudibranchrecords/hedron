import { combineReducers } from 'redux'
import sketchesReducer from './sketches/reducer'
import paramsReducer from './params/reducer'

const rootReducer = combineReducers({
  sketches: sketchesReducer,
  params: paramsReducer
})

export default rootReducer
