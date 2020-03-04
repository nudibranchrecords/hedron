/** * SETUP ***/

import listen from 'redux-action-listeners'
import { createStore, applyMiddleware, combineReducers } from 'redux'

import inputsReducer from '../src/store/inputs/reducer'
import nodesReducer from '../src/store/nodes/reducer'
import inputLinkReducer from '../src/store/inputLinks/reducer'
import inputLinkListener from '../src/store/inputLinks/listener'
import nodeListener from '../src/store/nodes/listener'

import { constructMidiId } from '../src/utils/midiMessage'

import { uInputLinkUpdateMidiInput, uInputLinkCreate, uInputLinkDelete } from '../src/store/inputLinks/actions'
import { inputLinkCreate, inputLinkDelete } from '../src/store/inputLinks/sagas'

import { fork } from 'redux-saga/effects'
import { watchInputLinks } from '../src/store/inputLinks/sagas'

import createSagaMiddleware from 'redux-saga'
import { MockUid } from './utils/MockUid'
import { uNodeDelete } from '../src/store/nodes/actions'
const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers(
  {
    nodes: nodesReducer,
    inputs: inputsReducer,
    inputLinks: inputLinkReducer,
  }
)

const mockUid = new MockUid(['link'])

jest.mock('uid', () => () => mockUid.getNewId())

const rootListener = {
  types: 'all',

  handleAction (action, dispatched, store) {
    inputLinkListener(action, store)
    nodeListener(action, store)
  },
}

function* rootSaga (dispatch) {
  yield [
    fork(watchInputLinks),
  ]
}

/** * TEST ***/

test('(mock) Input Links - Update link midi input', () => {
  const messageType = 'controlChange'
  const noteNum = 100
  const channel = 13

  // State starts assuming some dropdown value have changed
  const startState = {
    nodes: {
      option_a: {
        key: 'channel',
        value: channel,
      },
      option_b: {
        key: 'messageType',
        value: messageType,
      },
      option_c: {
        key: 'noteNum',
        value: noteNum,
      },
      option_x: {
        key: 'foo',
        value: 1,
      },
      link_a: {
        id: 'link_a',
        optionIds: [
          'option_a', 'option_b', 'option_c',
        ],
        input: {
          id: 'midi_0_0',
          type: 'midi',
        },
      },
    },
    inputs: {
      midi_0_0: {
        assignedLinkIds: [
          'link_a',
        ],
      },
    },
    inputLinks: {
      nodeIds: ['link_a'],
    },
  }

  const store = createStore(rootReducer, startState, applyMiddleware(listen(rootListener)))

  let state

  // The dropdown value has changed and so this action would be dispatched
  store.dispatch(uInputLinkUpdateMidiInput('link_a'))
  state = store.getState()

  const oldInput = state.inputs.midi_0_0
  expect(oldInput.assignedLinkIds.length).toBe(0)

  const newInputId = constructMidiId(messageType, noteNum, channel)
  const newInput = state.inputs[newInputId]
  expect(newInput.assignedLinkIds[0]).toBe('link_a')

  const link = state.nodes.link_a
  expect(link.input.id).toBe(newInputId)
})

test('(mock) Input Links - Add/Remove/Remove Node with link', () => {
  mockUid.resetMocks()

  const startState = {
    nodes: {
      node_1: {
        id: 'node_1',
        inputLinkIds: [],
      },
    },
    inputs: {
    },
    inputLinks: {
      nodeIds: [],
    },
  }

  const store = createStore(rootReducer, startState, applyMiddleware(sagaMiddleware, listen(rootListener)))
  sagaMiddleware.run(rootSaga, store.dispatch)

  mockUid.currentMockName = 'link'
  store.dispatch(uInputLinkCreate('node_1', 'midi_1', 'midi'))

  let state
  state = store.getState()

  // Update input link nodeId list
  expect(state.inputLinks).toEqual({
    nodeIds: ['link_1'],
  })

  // Add link to inputs
  expect(state.inputs).toEqual({
    midi_1: {
      assignedLinkIds: ['link_1'],
    },
  })

  // Add link to nodes
  expect(state.nodes.link_1).toMatchObject({
    id: 'link_1',
    type: 'inputLink',
    nodeId: 'node_1',
    input: {
      type: 'midi',
      id: 'midi_1',
    },
  })

  // Has some options
  expect(state.nodes.link_1.optionIds.length).toBeGreaterThan(0)

  // Has toggle action
  expect(state.nodes.link_1.linkableActions.toggleActivate).toBeTruthy()

  state.nodes.link_1.optionIds.forEach(id => {
    // Link node option Ids exist
    expect(state.nodes[id]).toBeTruthy()
  })

  // Has toggle action node
  expect(state.nodes[state.nodes.link_1.linkableActions.toggleActivate]).toBeTruthy()

  const numNodesWithOneLink = Object.keys(state.nodes).length

  mockUid.currentMockName = 'link'
  store.dispatch(uInputLinkCreate('node_1', 'midi_2', 'midi'))

  state = store.getState()

  expect(Object.keys(state.nodes).length).toBeGreaterThan(numNodesWithOneLink)

  // Update input link nodeId list
  expect(state.inputLinks).toEqual({
    nodeIds: ['link_1', 'link_2'],
  })

  store.dispatch(uInputLinkDelete('link_2'))

  state = store.getState()

  // All relevant nodes deleted when input link is deleted
  expect(Object.keys(state.nodes).length).toBe(numNodesWithOneLink)

  // Assigned link for input removed
  expect(state.inputs.midi_2.assignedLinkIds.length).toBe(0)

  store.dispatch(uNodeDelete('node_1'))

  state = store.getState()

  // Removing node removes all relevant state
  expect(state).toEqual({
    nodes: {},
    inputLinks: {
      nodeIds: [],
    },
    inputs: {
      midi_1: {
        assignedLinkIds: [],
      },
      midi_2: {
        assignedLinkIds: [],
      },
    },
  })
})

// TODO: Midi learn
