import { select, takeEvery, put, call } from 'redux-saga/effects'
import { getParamInputId, getDefaultModifierIds } from './selectors'
import { rParamInputUpdate, rParamCreate } from './actions'
import { inputAssignedParamDelete, inputAssignedParamCreate } from '../inputs/actions'
import { midiStartLearning } from '../midi/actions'
import getAllModifiers from 'modifiers'
import uid from 'uid'

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

export function* paramCreate (action) {
  const p = action.payload

  const modifiers = yield call(getAllModifiers)
  const defaultModifierIds = yield select(getDefaultModifierIds)
  const modifierIds = []

  for (let i = 0; i < defaultModifierIds.length; i++) {
    const id = defaultModifierIds[i]
    const config = modifiers[id].config

    const modifier = {
      key: id,
      title: config.title,
      value: config.defaultValue
    }

    const modifierId = yield call(uid)
    modifierIds.push(modifierId)
    yield put(rParamCreate(modifierId, modifier))
  }

  const param = p.param
  param.modifierIds = modifierIds

  yield put(rParamCreate(p.id, param))
}

export function* watchParams () {
  yield takeEvery('U_PARAM_INPUT_UPDATE', paramInputUpdate)
  yield takeEvery('U_PARAM_CREATE', paramCreate)
}
