// import test from 'tape'
// import deepFreeze from 'deep-freeze'
import macroReducer from '../reducer'
import { returnsPreviousState } from '../../../testUtils'
// import * as a from '../actions'

returnsPreviousState(macroReducer)
