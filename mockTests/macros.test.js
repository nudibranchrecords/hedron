import nodesReducer from '../src/store/nodes/reducer'
import macrosReducer from '../src/store/macros/reducer'
import uiReducer from '../src/store/ui/reducer'
import nodeListener from '../src/store/nodes/listener'

import { MockUid } from './utils/MockUid'
import { createMockStore } from './utils/createMockStore'

import { fork } from 'redux-saga/effects'
import { watchMacros, macroTargetParamLinkAdd } from '../src/store/macros/sagas'
import { uMacroCreate, rMacroLearningToggle, uMacroDelete, uMacroTargetParamLinkAdd, uMacroTargetParamLinkDelete } from '../src/store/macros/actions'

const mockUid = new MockUid(['macro', 'paramLink'])
jest.mock('uid', () => () => mockUid.getNewId())

function* rootSaga (dispatch) {
  yield [
    fork(watchMacros),
  ]
}

const setup = (startState = {
  nodes: {
    param_1: {
      id: 'param_1',
      connectedMacroIds: [],
    },
    param_2: {
      id: 'param_2',
      connectedMacroIds: [],
    },
  },
}) => {
  mockUid.resetMocks()

  return createMockStore({
    startState,
    reducers: {
      nodes: nodesReducer,
      macros: macrosReducer,
      ui: uiReducer,
    },
    listeners: [
      nodeListener,
    ],
    rootSaga,
  })
}

test('(mock) macros - create, learning start/stop, add/remove paramlink, delete', () => {
  const { store, startState } = setup()
  let state

  state = startState

  // Things start empty
  expect(state.macros.nodeIds).toEqual([])
  expect(state.macros.learningId).toBe(false)
  expect(state.macros.openedId).toBeFalsy()
  expect(state.ui.isEditing).toBe(false)

  mockUid.currentMockName = 'macro'
  store.dispatch(uMacroCreate())
  state = store.getState()

  // Creates a macro node
  expect(state.nodes.macro_1).toBeDefined()
  // Adds macro id to list
  expect(state.macros.nodeIds).toEqual(['macro_1'])
  // UI editing title for node
  expect(state.ui.isEditing).toEqual({
    id: 'macro_1',
    type: 'nodeTitle',
  })
  // open macro
  expect(state.macros.openedId).toBe('macro_1')

  mockUid.currentMockName = 'macro'
  store.dispatch(uMacroCreate())
  state = store.getState()

  // Creates a macro node
  expect(state.nodes.macro_2).toBeDefined()
  // Adds macro id to list
  expect(state.macros.nodeIds).toEqual(['macro_1', 'macro_2'])
  // UI editing title for node
  expect(state.ui.isEditing).toEqual({
    id: 'macro_2',
    type: 'nodeTitle',
  })
  // open macro
  expect(state.macros.openedId).toBe('macro_2')

  store.dispatch(rMacroLearningToggle('macro_2'))
  state = store.getState()

  // Macro learning ID set
  expect(state.macros.learningId).toBe('macro_2')

  store.dispatch(rMacroLearningToggle('macro_2'))
  state = store.getState()

  // Macro learning ID unset
  expect(state.macros.learningId).toBe(false)

  store.dispatch(rMacroLearningToggle('macro_1'))
  state = store.getState()

  // Macro learning ID set
  expect(state.macros.learningId).toBe('macro_1')

  store.dispatch(rMacroLearningToggle('macro_2'))
  state = store.getState()

  // Macro learning ID set from macro_1 to macro_2
  expect(state.macros.learningId).toBe('macro_2')

  store.dispatch(uMacroDelete('macro_2'))
  state = store.getState()

  // Removes macro node
  expect(state.nodes.macro_2).toBeUndefined()
  // Removes from list
  expect(state.macros.nodeIds).toEqual(['macro_1'])
  // Learning set to false
  expect(state.macros.learningId).toBe(false)
  // UI editing node updated
  expect(state.ui.isEditing).toBe(false)
  // Macro no longer open
  expect(state.macros.openedId).toBeFalsy()

  mockUid.currentMockName = 'paramLink'
  store.dispatch(uMacroTargetParamLinkAdd('macro_1', 'param_1'))
  mockUid.currentMockName = 'paramLink'
  store.dispatch(uMacroTargetParamLinkAdd('macro_1', 'param_2'))
  state = store.getState()

  // Creates a param link node
  expect(state.nodes.paramLink_1).toBeDefined()
  // Creates a param link node
  expect(state.nodes.paramLink_2).toBeDefined()
  // adds param link ref
  expect(state.nodes.macro_1.targetParamLinks.param_1).toBeDefined()
  // adds param link ref
  expect(state.nodes.macro_1.targetParamLinks.param_2).toBeDefined()
  // Adds connected macro id to node
  expect(state.nodes.param_1.connectedMacroIds).toEqual(['macro_1'])
  // Adds connected macro id to node
  expect(state.nodes.param_2.connectedMacroIds).toEqual(['macro_1'])

  store.dispatch(uMacroTargetParamLinkDelete('macro_1', 'param_1'))
  state = store.getState()

  // Removes param link node
  expect(state.nodes.paramLink_1).toBeUndefined()
  // Removes ref
  expect(state.nodes.macro_1.targetParamLinks.param_1).toBeUndefined()
  // Removes macro id from param node
  expect(state.nodes.param_1.connectedMacroIds).toEqual([])

  store.dispatch(uMacroDelete('macro_1'))
  state = store.getState()

  // State same as start of test (all related nodes removed)
  expect(state).toEqual(startState)
})
