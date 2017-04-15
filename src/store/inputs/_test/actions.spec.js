import test from 'tape'
import { inputFired, inputsReplaceAll, inputAssignedParamAdd } from '../actions'

test('(Action Creator) inputFired', (t) => {
  let actual = inputFired('audio_0', 0.123)
  let expected = {
    type: 'INPUT_FIRED',
    payload: {
      inputId: 'audio_0',
      value: 0.123
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

test('(Action Creator) inputAssignedParamAdd', (t) => {
  let actual = inputAssignedParamAdd('INPUTID', 'PARAMID')
  let expected = {
    type: 'INPUT_ASSIGNED_PARAM_ADD',
    payload: {
      inputId: 'INPUTID',
      paramId: 'PARAMID'
    }
  }
  t.deepEqual(actual, expected, 'Creates action to assign a param to input')
  t.end()
})
