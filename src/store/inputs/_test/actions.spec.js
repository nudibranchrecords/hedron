import test from 'tape'
import { inputFired, inputsReplaceAll, inputAssignedNodeCreate, inputAssignedNodeDelete } from '../actions'

test('(Action Creator) inputFired', (t) => {
  let actual = inputFired('audio_0', 0.123, false)
  let expected = {
    type: 'INPUT_FIRED',
    payload: {
      inputId: 'audio_0',
      value: 0.123,
      noteOn: false
    }
  }
  t.deepEqual(actual, expected, 'Creates action for when an input comes in')
  t.end()
})

test('(Action Creator) inputsReplaceAll', (t) => {
  const inputs = { foo:'bar' }
  let actual = inputsReplaceAll(inputs)
  let expected = {
    type: 'INPUTS_REPLACE_ALL',
    payload: {
      inputs
    }
  }
  t.deepEqual(actual, expected, 'Creates action for when replacing entire inputs state')
  t.end()
})

test('(Action Creator) inputAssignedNodeCreate', (t) => {
  let actual = inputAssignedNodeCreate('INPUTID', 'NODEID')
  let expected = {
    type: 'INPUT_ASSIGNED_NODE_CREATE',
    payload: {
      inputId: 'INPUTID',
      nodeId: 'NODEID'
    }
  }
  t.deepEqual(actual, expected, 'Creates action to assign a node to input')
  t.end()
})

test('(Action Creator) inputAssignedNodeDelete', (t) => {
  let actual = inputAssignedNodeDelete('INPUTID', 'NODEID')
  let expected = {
    type: 'INPUT_ASSIGNED_NODE_DELETE',
    payload: {
      inputId: 'INPUTID',
      nodeId: 'NODEID'
    }
  }
  t.deepEqual(actual, expected, 'Creates action to delete a node from input')
  t.end()
})
