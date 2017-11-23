import { select, put, call, takeEvery } from 'redux-saga/effects'
import getNode from '../../selectors/getNode'
import getMacro from '../../selectors/getMacro'
import macroInterpolate from '../../utils/macroInterpolate'
import { rNodeCreate, nodeValueUpdate } from '../nodes/actions'
import { rMacroCreate, rMacroTargetParamLinkCreate, rMacroTargetParamLinkUpdateStartValue } from './actions'

import uid from 'uid'

export function* macroCreate (action) {
  const macroId = yield call(uid)
  const nodeId = yield call(uid)
  yield put(rNodeCreate(nodeId, {
    title: 'New Macro',
    type: 'macro',
    macroId: macroId,
    value: 0
  }))
  yield put(rMacroCreate(macroId, nodeId))
}

export function* macroTargetParamLinkAdd (action) {
  const p = action.payload
  const param = yield select(getNode, p.paramId)
  const nodeId = yield call(uid)
  yield put(rNodeCreate(nodeId, {
    title: param.title
  }))
  yield put(rMacroTargetParamLinkCreate(p.macroId, p.paramId, nodeId))
}

/*
This is called for any node value that is updated. The node is checked and if
it is a macro type node:
- macroTargetParam links are got

- *not yet implemented*
  a target time is set for the macro, of now + X seconds,
  this happens every time the same macro is updated and will be checked by
  another saga at regular intervals to reset the macro if has been inactive

- If not yet set, a 'startValue' is set for each link,
  using the current param value
- An interpolation is done between 'startValue' and
  the node value for the link (the target value), based on the macro node value
- the param value is updated with new interpolated value
*/
export function* macroProcess (action) {
  const p = action.payload
  const node = yield select(getNode, p.id)

  if (node.type === 'macro') {
    const m = yield select(getMacro, node.macroId)
    const links = m.targetParamLinks
    const keys = Object.keys(links)

    for (let i = 0; i < keys.length; i++) {
      const l = links[keys[i]]
      let startValue = l.startValue
      if (startValue === false) {
        const p = yield select(getNode, l.paramId)
        startValue = p.value
        yield put(rMacroTargetParamLinkUpdateStartValue(node.macroId, l.paramId, startValue))
      }
      const n = yield select(getNode, l.nodeId)
      const val = yield call(macroInterpolate, startValue, n.value, p.value)
      yield put(nodeValueUpdate(l.paramId, val))
    }
  }
}

export function* watchMacros () {
  yield takeEvery('U_MACRO_CREATE', macroCreate)
  yield takeEvery('U_MACRO_TARGET_PARAM_LINK_ADD', macroTargetParamLinkAdd)
  yield takeEvery('NODE_VALUE_UPDATE', macroProcess)
}
