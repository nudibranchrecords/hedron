import { combineReducers } from 'redux'
import sketches from './sketches'
import params from './params'

const rootReducer = combineReducers({
  sketches,
  params
})

export default rootReducer
