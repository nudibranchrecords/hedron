import { select, put, call, takeEvery } from 'redux-saga/effects'
import getNode from '../../selectors/getNode'
import getMacro from '../../selectors/getMacro'
import getMacroTargetParamLinks from '../../selectors/getMacroTargetParamLinks'
import { rNodeCreate, nodeValueUpdate } from '../nodes/actions'
import { rMacroCreate, rMacroTargetParamLinkAdd } from './actions'
import { rMacroTargetParamLinkCreate } from '../macroTargetParamLinks/actions'

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
  const linkId = yield call(uid)
  const nodeId = yield call(uid)
  yield put(rNodeCreate(nodeId, {
    title: param.title
  }))
  yield put(rMacroTargetParamLinkCreate(linkId, nodeId, p.paramId))
  yield put(rMacroTargetParamLinkAdd(p.macroId, linkId))
}

export function* macroProcess (action) {
  const p = action.payload
  const node = yield select(getNode, p.id)

  if (node.type === 'macro') {
    const macro = yield select(getMacro, node.macroId)
    const links = yield select(getMacroTargetParamLinks, macro.targetParamLinks)
    for (let i = 0; i < links.length; i++) {
      const l = links[i]
      // const node = yield select(getNode, l.nodeId)
      yield put(nodeValueUpdate(l.paramId, p.value))
    }
  }
}

export function* watchMacros () {
  yield takeEvery('U_MACRO_CREATE', macroCreate)
  yield takeEvery('U_MACRO_TARGET_PARAM_LINK_ADD', macroTargetParamLinkAdd)
  yield takeEvery('NODE_VALUE_UPDATE', macroProcess)
}
