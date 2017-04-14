import { select, takeEvery, put } from 'redux-saga/effects'
import { getAssignedParams } from './selectors'
import { sketchesParamValueUpdate } from '../sketches/actions'
import { projectError } from '../project/actions'

export function* handleInput (action) {
  const p = action.payload

  try {
    const params = yield select(getAssignedParams, p.inputId)

    for (let i = 0; i < params.length; i++) {
      yield put(sketchesParamValueUpdate(params[i].id, p.value))
    }
  } catch (error) {
    yield put(projectError(error.message))
  }
}

export function* watchInputs () {
  yield takeEvery('INPUT_FIRED', handleInput)
}
