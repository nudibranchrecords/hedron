import 'babel-polyfill'
import test from 'tape'
import { select, takeEvery, put } from 'redux-saga/effects'
import { watchInputs, handleInput } from '../sagas'
import { getAssignedParams } from '../selectors'
import { sketchesParamValueUpdate } from '../../sketches/actions'
import { projectError } from '../../project/actions'

test('(Saga) watchInputs', (t) => {
  const generator = watchInputs()
  t.deepEqual(
    generator.next().value,
    takeEvery('INPUT_FIRED', handleInput)
  )
  t.end()
})

test('(Saga) handleInput', (t) => {
  const generator = handleInput({
    payload: {
      value: 0.2,
      inputId: 'audio_0'
    }
  })

  t.deepEqual(
    generator.next().value,
    select(getAssignedParams, 'audio_0'),
    '1. Gets assigned params'
  )

  const params = [
    {
      id: 'XX'
    },
    {
      id: 'YY'
    }
  ]

  t.deepEqual(
    generator.next(params).value,
    put(sketchesParamValueUpdate('XX', 0.2)),
    '2.x Dispatches param update action'
  )

  t.deepEqual(
    generator.next(params).value,
    put(sketchesParamValueUpdate('YY', 0.2)),
    '2.x Dispatches param update action'
  )

  t.deepEqual(
    generator.throw({ message: 'Error!' }).value,
    put(projectError('Error!')),
    'Dispatches project error if some error'
  )

  t.end()
})
