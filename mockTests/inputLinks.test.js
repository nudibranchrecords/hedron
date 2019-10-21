/** * SETUP ***/

import proxyquire from 'proxyquire'
import listen from 'redux-action-listeners'
import { createStore, applyMiddleware, combineReducers } from 'redux'

import inputsReducer from '../src/store/inputs/reducer'
import nodesReducer from '../src/store/nodes/reducer'
import inputLinksReducer from '../src/store/inputLinks/reducer'

import { constructMidiId } from '../src/utils/midiMessage'

import { uInputLinkUpdateMidiInput } from '../src/store/inputLinks/actions'

const rootReducer = combineReducers(
  {
    nodes: nodesReducer,
    inputs: inputsReducer,
    inputLinks: inputLinksReducer,
  }
)

let uniqueId
const uid = () => {
  uniqueId++
  return 'id_' + uniqueId
}

const inputLinksListener = proxyquire('../src/store/inputLinks/listener', {
  'uid': uid,
}).default

const rootListener = {
  types: 'all',

  handleAction (action, dispatched, store) {
    inputLinksListener(action, store)
  },
}

/** * TEST ***/

test('(mock) Input Links - Update link midi input', () => {
  uniqueId = 0
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
