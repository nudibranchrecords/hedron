import test from 'tape'
import deepFreeze from 'deep-freeze'

import sketchesReducer from '../reducer'
import { returnsPreviousState } from '../../../testUtils'

returnsPreviousState(sketchesReducer)
