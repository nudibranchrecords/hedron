import { combineReducers } from 'redux'
import { ignoreActions } from 'redux-ignore'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'

import difference from 'lodash/difference'

import sketchesReducer from './sketches/reducer'
import projectReducer from './project/reducer'
import inputsReducer from './inputs/reducer'
import nodesReducer from './nodes/reducer'
import inputLinkReducer from './inputLinks/reducer'
import midiReducer from './midi/reducer'
import clockReducer from './clock/reducer'
import availableModulesReducer from './availableModules/reducer'
import displaysReducer from './displays/reducer'
import macroReducer from './macros/reducer'
import uiReducer from './ui/reducer'
import linkableActionsReducer from './linkableActions/reducer'
import settingsReducer from './settings/reducer'

const ignoreList = [
  'CLOCK_PULSE', 'CLOCK_BEAT_INC',
  'CLOCK_BPM_UPDATE', 'INPUT_FIRED',
  'NODE_VALUE_UPDATE', 'NODE_VALUES_BATCH_UPDATE'
]

const reducers = combineReducers({
  nodes: ignoreActions(nodesReducer, difference(ignoreList, ['NODE_VALUE_UPDATE', 'NODE_VALUES_BATCH_UPDATE'])),
  availableModules: ignoreActions(availableModulesReducer, ignoreList),
  sketches: ignoreActions(sketchesReducer, ignoreList),
  project: ignoreActions(projectReducer, ignoreList),
  inputs: ignoreActions(inputsReducer, difference(ignoreList, ['INPUT_FIRED'])),
  inputLinks: ignoreActions(inputLinkReducer, ignoreList),
  linkableActions: ignoreActions(linkableActionsReducer, ignoreList),
  clock: ignoreActions(clockReducer, difference(ignoreList, ['CLOCK_PULSE', 'CLOCK_BEAT_INC', 'CLOCK_BPM_UPDATE'])),
  midi: ignoreActions(midiReducer, ignoreList),
  displays: ignoreActions(displaysReducer, ignoreList),
  macros: ignoreActions(macroReducer, ignoreList),
  ui: ignoreActions(uiReducer, ignoreList),
  router: ignoreActions(routerReducer, ignoreList),
  settings: ignoreActions(settingsReducer, ignoreList),
  form: ignoreActions(formReducer, ignoreList)
})

const rootReducer = (state = {}, action) => action.type === 'PROJECT_REHYDRATE'
? {
  ...state,
  ...action.payload.data
}
: reducers(state, action)

export default rootReducer
