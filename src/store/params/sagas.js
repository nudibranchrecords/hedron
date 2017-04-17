import { select, takeEvery, put } from 'redux-saga/effects'
import { getParamInputId } from './selectors'
import { rParamInputUpdate } from './actions'
import { inputAssignedParamDelete, inputAssignedParamCreate } from '../inputs/actions'
import { midiStartLearning } from '../midi/actions'

export function* paramInputUpdate (action) {
  const p = action.payload
  const inputId = p.inputId !== 'none' ? p.inputId : false
  const input = inputId ? { id: inputId } : false

  const oldInputId = yield select(getParamInputId, p.paramId)

  if (oldInputId) {
    yield put(inputAssignedParamDelete(oldInputId, p.paramId))
  }

  if (inputId === 'midi') {
    yield put(midiStartLearning(p.paramId))
  } else {
    if (inputId) {
      yield put(inputAssignedParamCreate(inputId, p.paramId))
    }
    yield put(rParamInputUpdate(p.paramId, input))
  }
}

export function* watchParams () {
  yield takeEvery('U_PARAM_INPUT_UPDATE', paramInputUpdate)
}
