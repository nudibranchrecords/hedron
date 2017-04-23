import { select, takeEvery, put, call } from 'redux-saga/effects'
import { getAssignedParams } from './selectors'
import { paramValueUpdate } from '../params/actions'
import { projectError } from '../project/actions'
import getParams from '../../selectors/getParams'
import { work } from 'modifiers'

export function* handleInput (action) {
  const p = action.payload
  let value = p.value

  try {
    const params = yield select(getAssignedParams, p.inputId)

    for (let i = 0; i < params.length; i++) {
      let modifiers

      if (params[i].modifierIds && params[i].modifierIds.length) {
        modifiers = yield select(getParams, params[i].modifierIds)

        for (let j = 0; j < modifiers.length; j++) {
          value = yield call(work, modifiers[j].key, modifiers[j].value, value)
        }
      }

      yield put(paramValueUpdate(params[i].id, value))
    }
  } catch (error) {
    yield put(projectError(error.message))
  }
}

export function* watchInputs () {
  yield takeEvery('INPUT_FIRED', handleInput)
}
