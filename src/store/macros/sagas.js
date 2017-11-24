import { select, put, call, takeEvery } from 'redux-saga/effects'
import getNode from '../../selectors/getNode'
import getMacro from '../../selectors/getMacro'
import { shouldItLearn } from './utils'
import getMacroLearningId from '../../selectors/getMacroLearningId'
import getMacroTargetParamLink from '../../selectors/getMacroTargetParamLink'
import macroInterpolate from '../../utils/macroInterpolate'
import { rNodeCreate, nodeValueUpdate, uNodeDelete, rNodeConnectedMacroAdd,
          rNodeConnectedMacroRemove
} from '../nodes/actions'
import { rMacroCreate, rMacroDelete, rMacroTargetParamLinkCreate, rMacroTargetParamLinkDelete,
        rMacroTargetParamLinkUpdateStartValue, uMacroTargetParamLinkAdd, rMacroLearningToggle
} from './actions'

import uid from 'uid'

export function* macroCreate (action) {
  const macroId = yield call(uid)
  const nodeId = yield call(uid)
  yield put(rNodeCreate(nodeId, {
    title: 'New Macro',
    type: 'macro',
    isOpen: true,
    macroId: macroId,
    value: 0
  }))
  yield put(rMacroCreate(macroId, nodeId))
}

export function* macroDelete (action) {
  const macroId = action.payload.id
  const macro = yield select(getMacro, macroId)
  yield put(rMacroLearningToggle(false))
  yield put(rMacroDelete(macroId))
  yield put(uNodeDelete(macro.nodeId))

  for (const linkId in macro.targetParamLinks) {
    const link = macro.targetParamLinks[linkId]
    yield put(uNodeDelete(link.nodeId))
    yield put(rNodeConnectedMacroRemove(link.paramId, macroId))
  }
}

export function* macroTargetParamLinkAdd (action) {
  const p = action.payload
  const param = yield select(getNode, p.paramId)
  const nodeId = yield call(uid)
  yield put(rNodeCreate(nodeId, {
    title: param.title,
    type: 'macroTargetParamLink'
  }))
  yield put(rMacroTargetParamLinkCreate(p.macroId, p.paramId, nodeId))
  yield put(rNodeConnectedMacroAdd(p.paramId, p.macroId))
}

export function* macroTargetParamLinkDelete (action) {
  const p = action.payload
  const link = yield select(getMacroTargetParamLink, p.macroId, p.paramId)
  yield put(rMacroTargetParamLinkDelete(p.macroId, p.paramId))
  yield put(uNodeDelete(link.nodeId))
  yield put(rNodeConnectedMacroRemove(p.paramId, p.macroId))
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
export function* macroProcess (p, node) {
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
    yield put(nodeValueUpdate(l.paramId, val, { type: 'macro' }))
  }
}

export function* macroLearnFromParam (p, macroId) {
  let link = yield select(getMacroTargetParamLink, macroId, p.id)

  if (!link) {
    yield call(macroTargetParamLinkAdd, uMacroTargetParamLinkAdd(macroId, p.id))
    link = yield select(getMacroTargetParamLink, macroId, p.id)
  }

  yield put(nodeValueUpdate(link.nodeId, p.value))
}

export function* handleNodeValueUpdate (action) {
  const p = action.payload
  if (!p.meta || p.meta.type !== 'macro') {
    const node = yield select(getNode, p.id)

    const nodeMacroIds = node.connectedMacroIds
    const learningId = yield select(getMacroLearningId)

    if (node.type === 'macro') {
      yield call(macroProcess, action.payload, node)
    } else {
      const learn = yield call(shouldItLearn, learningId, node, p)
      if (learn) {
        yield call(macroLearnFromParam, action.payload, learningId)
      }
      if (nodeMacroIds) {
        for (let i = 0; i < nodeMacroIds.length; i++) {
          yield put(rMacroTargetParamLinkUpdateStartValue(nodeMacroIds[i], p.id, false))
        }
      }
    }
  }
}

export function* watchMacros () {
  yield takeEvery('U_MACRO_CREATE', macroCreate)
  yield takeEvery('U_MACRO_DELETE', macroDelete)
  yield takeEvery('U_MACRO_TARGET_PARAM_LINK_ADD', macroTargetParamLinkAdd)
  yield takeEvery('U_MACRO_TARGET_PARAM_LINK_DELETE', macroTargetParamLinkDelete)
  yield takeEvery('NODE_VALUE_UPDATE', handleNodeValueUpdate)
}
