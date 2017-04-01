import { combineReducers } from 'redux'
import sketchesReducer from './sketches/reducer'

const rootReducer = combineReducers({
  sketches: sketchesReducer
})

export default rootReducer
