import { select, put, call } from 'redux-saga/effects'
import { getDefaultModifierIds } from './selectors'
import { rInputLinkCreate } from './actions'
import { rNodeCreate } from '../nodes/actions'
import { getAll } from 'modifiers'
import uid from 'uid'

export function* inputLinkCreate (action) {
  const p = action.payload

  const modifiers = yield call(getAll)
  const defaultModifierIds = yield select(getDefaultModifierIds)
  const modifierIds = []

  for (let i = 0; i < defaultModifierIds.length; i++) {
    const id = defaultModifierIds[i]
    const config = modifiers[id].config

    for (let j = 0; j < config.title.length; j++) {
      const modifierId = yield call(uid)
      const modifier = {
        id: modifierId,
        key: id,
        title: config.title[j],
        value: config.defaultValue[j],
        passToNext: j < config.title.length - 1,
        type: config.type
      }

      modifierIds.push(modifierId)
      yield put(rNodeCreate(modifierId, modifier))
    }
  }

  const link = p.link
  link.modifierIds = modifierIds

  yield put(rInputLinkCreate(p.id, link))
}
