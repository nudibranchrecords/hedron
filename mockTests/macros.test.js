import nodesReducer from '../src/store/nodes/reducer'
import macroReducer from '../src/store/macros/reducer'
import uiReducer from '../src/store/ui/reducer'
import nodeListener from '../src/store/nodes/listener'
import macroListener from '../src/store/macros/listener'

import { MockUid } from './utils/MockUid'
import { createMockStore } from './utils/createMockStore'

import { uMacroCreate, rMacroLearningToggle, uMacroDelete, uMacroTargetParamLinkAdd,
  uMacroTargetParamLinkDelete } from '../src/store/macros/actions'
import { nodeValueUpdate, nodeValuesBatchUpdate } from '../src/store/nodes/actions'

const mockUid = new MockUid(['macro', 'paramLink'])
jest.mock('uid', () => () => mockUid.getNewId())

const setup = (startState = {
  nodes: {
    param_1: {
      id: 'param_1',
      connectedMacroIds: [],
      valueType: 'float',
    },
    param_2: {
      id: 'param_2',
      connectedMacroIds: [],
      valueType: 'float',
    },
    param_3: {
      id: 'param_3',
      connectedMacroIds: [],
      valueType: 'float',
    },
  },
}) => {
  mockUid.resetMocks()

  return createMockStore({
    startState,
    reducers: {
      nodes: nodesReducer,
      macros: macroReducer,
      ui: uiReducer,
    },
    listeners: [
      nodeListener,
      macroListener,
    ],
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

test('(mock) macros - paramlink creation while learning', () => {
  const { store } = setup()
  let state

  // Set up with 2 macros
  mockUid.currentMockName = 'macro'
  store.dispatch(uMacroCreate())
  mockUid.currentMockName = 'macro'
  store.dispatch(uMacroCreate())
  const startState = store.getState()

  store.dispatch(nodeValueUpdate('param_1', 0.5))
  store.dispatch(nodeValuesBatchUpdate([
    {
      id: 'param_1',
      value: 0.8,
    },
    {
      id: 'param_2',
      value: 0.8,
    },
  ]))
  state = store.getState()

  // Nothing happens to macro if node changes but not learning
  expect(state.nodes.macro_1).toEqual(startState.nodes.macro_1)
  expect(state.nodes.macro_2).toEqual(startState.nodes.macro_2)

  mockUid.currentMockName = 'paramLink'
  store.dispatch(rMacroLearningToggle('macro_1'))
  store.dispatch(nodeValueUpdate('param_1', 0.4))
  state = store.getState()

  // paramLink node created while learning
  expect(state.nodes.paramLink_1.type).toBe('macroTargetParamLink')
  expect(state.nodes.paramLink_1.value).toBe(0.4)

  // param updated with connected macro
  expect(state.nodes.param_1.connectedMacroIds).toEqual(['macro_1'])
  // paramLink ref added to macro
  expect(state.nodes.macro_1.targetParamLinks).toEqual({
    'param_1': {
      'nodeId': 'paramLink_1',
      'paramId': 'param_1',
      'startValue': null,
    },
  })

  store.dispatch(nodeValueUpdate('param_1', 0.3))
  state = store.getState()

  // Value of param link updates while learning
  expect(state.nodes.paramLink_1.value).toBe(0.3)

  mockUid.currentMockName = 'paramLink'
  store.dispatch(nodeValuesBatchUpdate([
    {
      id: 'param_1',
      value: 0.5,
    },
    {
      id: 'param_2',
      value: 0.5,
    },
  ]))
  state = store.getState()

  // Value of param link updates on batch node update
  expect(state.nodes.paramLink_1.value).toBe(0.5)
  // paramLink node created while learning on batch node update
  expect(state.nodes.paramLink_2.type).toBe('macroTargetParamLink')
  expect(state.nodes.paramLink_2.value).toBe(0.5)

  const twoLinks = {
    'param_1': {
      'nodeId': 'paramLink_1',
      'paramId': 'param_1',
      'startValue': null,
    },
    'param_2': {
      'nodeId': 'paramLink_2',
      'paramId': 'param_2',
      'startValue': null,
    },
  }

  // paramLink ref added to macro
  expect(state.nodes.macro_1.targetParamLinks).toEqual(twoLinks)

  store.dispatch(nodeValueUpdate('macro_2', 0.3))
  state = store.getState()

  // Macros dont get added while learning
  expect(state.nodes.macro_1.targetParamLinks).toEqual(twoLinks)

  store.dispatch(nodeValueUpdate('paramLink_2', 0.3))
  state = store.getState()

  // Param links dont get added while learning
  expect(state.nodes.macro_1.targetParamLinks).toEqual(twoLinks)

  store.dispatch(nodeValueUpdate('param_3', 0.3, { type: 'lfo' }))
  state = store.getState()

  // Params dont get added if not from a human
  expect(state.nodes.macro_1.targetParamLinks).toEqual(twoLinks)

  store.dispatch(nodeValueUpdate('macro_1', 0.3))
  state = store.getState()

  // Macro itself does work while learning
  expect(state.nodes.macro_1.targetParamLinks.param_1.startValue).not.toBe(null)
})

test('(mock) macros - Usage', () => {
  // Setup with two macros. One has two params, the other one. The share one.
  const { store, startState } = setup({
    nodes: {
      param_1: {
        id: 'param_1',
        connectedMacroIds: ['macro_1'],
        valueType: 'float',
        value: 0.1,
      },
      param_2: {
        id: 'param_2',
        connectedMacroIds: ['macro_1', 'macro_2'],
        valueType: 'float',
        value: 0.1,
      },
      macro_1: {
        id: 'macro_1',
        value: false,
        type: 'macro',
        targetParamLinks: {
          'param_1': {
            'nodeId': 'paramLink_1a',
            'paramId': 'param_1',
            'startValue': null,
          },
        },
        valueType: 'float',
      },
      macro_2: {
        id: 'macro_2',
        value: 0,
        type: 'macro',
        targetParamLinks: {
          'param_1': {
            'nodeId': 'paramLink_1b',
            'paramId': 'param_1',
            'startValue': null,
          },
          'param_2': {
            'nodeId': 'paramLink_2a',
            'paramId': 'param_2',
            'startValue': null,
          },
        },
        valueType: 'float',
      },
      paramLink_1a: {
        id: 'paramLink_1a',
        value: 0.5,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        valueType: 'float',
        type: 'macroTargetParamLink',
      },
      paramLink_1b: {
        id: 'paramLink_1b',
        value: 0.75,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        valueType: 'float',
        type: 'macroTargetParamLink',
      },
      paramLink_2a: {
        id: 'paramLink_2a',
        value: 0.8,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        valueType: 'float',
        type: 'macroTargetParamLink',
      },
    },
    macros: {
      learningId: false,
      openedId: 'macro_2',
      lastId: undefined,
      nodeIds: [ 'macro_1', 'macro_2' ],
    },
  })

  let state = startState

  store.dispatch(nodeValueUpdate('macro_1', 0.5))
  state = store.getState()

  // Value of macro should update as normal
  expect(state.nodes.macro_1.value).toBeCloseTo(0.5)
  // Start value of paramLink should match current value of param
  expect(state.nodes.macro_1.targetParamLinks.param_1.startValue).toBeCloseTo(0.1)
  // Value of connected param should update based on paramLink targetValue
  expect(state.nodes.param_1.value).toBeCloseTo(0.3)

  store.dispatch(nodeValueUpdate('macro_1', 1))
  state = store.getState()

  // Value of macro should update as normal
  expect(state.nodes.macro_1.value).toBeCloseTo(1)
  // Start value of paramLink should stay the same as before
  expect(state.nodes.macro_1.targetParamLinks.param_1.startValue).toBeCloseTo(0.1)
  // Value of connected param should update based on paramLink targetValue
  expect(state.nodes.param_1.value).toBeCloseTo(0.5)

  store.dispatch(nodeValueUpdate('macro_2', 1))
  state = store.getState()

  // Value of macro should update as normal
  expect(state.nodes.macro_2.value).toBeCloseTo(1)
  // Value of connected param should update based on paramLink targetValue
  expect(state.nodes.param_1.value).toBeCloseTo(0.75)
  // Value of connected param should update based on paramLink targetValue
  expect(state.nodes.param_2.value).toBeCloseTo(0.8)
  // Value of other macro should reset to fase, as they share params
  expect(state.nodes.macro_1.value).toBe(false)
  // Start value of other macro paramLinks should be reset to null
  expect(state.nodes.macro_1.targetParamLinks.param_1.startValue).toBe(null)
})
