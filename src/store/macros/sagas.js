import { select, put, call, takeEvery } from 'redux-saga/effects'
import getNode from '../../selectors/getNode'
import getMacro from '../../selectors/getMacro'
import { shouldItLearn } from './utils'
import getMacroLearningId from '../../selectors/getMacroLearningId'
import getMacroTargetParamLink from '../../selectors/getMacroTargetParamLink'
import getMacroLastId from '../../selectors/getMacroLastId'
import macroInterpolate from '../../utils/macroInterpolate'
import isInputTypeHuman from '../../utils/isInputTypeHuman'
import { rNodeCreate, nodeValueUpdate, uNodeDelete, rNodeConnectedMacroAdd,
          rNodeConnectedMacroRemove, nodeValuesBatchUpdate
} from '../nodes/actions'
import { rMacroCreate, rMacroDelete, rMacroTargetParamLinkCreate, rMacroTargetParamLinkDelete,
        rMacroTargetParamLinkUpdateStartValue, uMacroTargetParamLinkAdd, rMacroLearningToggle,
        rMacroUpdateLastId, rMacroOpenToggle
} from './actions'
import { uiEditingOpen } from '../ui/actions'
import { projectError } from '../project/actions'

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
  yield put(rMacroOpenToggle(macroId))
  yield put(uiEditingOpen('nodeTitle', nodeId))
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
  const values = []

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
    values.push(
      {
        id: l.paramId,
        value: val
      }
    )
  }

  yield put(nodeValuesBatchUpdate(values, { type: 'macro', macroId: node.macroId }))
}

export function* macroLearnFromParam (p, macroId) {
  let link = yield select(getMacroTargetParamLink, macroId, p.id)

  if (!link) {
    yield call(macroTargetParamLinkAdd, uMacroTargetParamLinkAdd(macroId, p.id))
    link = yield select(getMacroTargetParamLink, macroId, p.id)
  }

  yield put(nodeValueUpdate(link.nodeId, p.value))
}

// When a node value is updated, a few things can happen:
// 1. MACRO: Macro is processed
// 2. OTHER VALUE: New param is added to a macro (learning)
// 3. OTHER VALUE: A node value has changed that has macros assigned to it:
//    - The macros assigned to it need to be reset to false
//      (to stop value jumping next time they are used)
//    - If the action has come from a macro, this macro should
//      not be reset to false
export function* handleNodeValueUpdate (action) {
  try {
    const p = action.payload
    const senderType = p.meta && p.meta.type
    const senderMacroId = p.meta && p.meta.macroId

    const node = yield select(getNode, p.id)

    if (node.type === 'macro' && senderType !== 'macro') {
    // Normal behaviour, simple process of macro using value of node
      yield call(macroProcess, p, node)
    } else if (node.type !== 'macro') {
      const isHuman = yield call(isInputTypeHuman, senderType)

      if (isHuman) {
        const learningId = yield select(getMacroLearningId)
      // Learning logic here
        const learn = yield call(shouldItLearn, learningId, node, p)
        if (learn) {
          yield call(macroLearnFromParam, p, learningId)
        }
        const nodeMacroIds = node.connectedMacroIds
        // If this node has macros assigned to it
        if (nodeMacroIds) {
          // Go through the macros
          for (let i = 0; i < nodeMacroIds.length; i++) {
            const macroId = nodeMacroIds[i]
            // If this action has not come from the macro assigned to it
            // then reset that macro and relevant start vals
            if (senderMacroId !== macroId) {
              const macro = yield select(getMacro, macroId)
              const node = yield select(getNode, macro.nodeId)

              if (node.value !== false) {
                for (const key in macro.targetParamLinks) {
                  yield put(rMacroTargetParamLinkUpdateStartValue(macroId, key, false))
                }

                yield put(nodeValueUpdate(macro.nodeId, false, { type: 'macro' }))
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(error)
    yield put(projectError(`Failed to process macro: ${error.message}`))
  }
}
export function* handleNodeRangeUpdate (action) {
  const p = action.payload
  const node = yield select(getNode, p.id)
  if (p.value.min) {
    node.min = p.value.min
  }
  if (p.value.max) {
    node.max = p.value.max
  }
}

export function* handleNodeValueBatchUpdate (action) {
  const p = action.payload
  let doLoop = false
  const type = p.meta && p.meta.type

  // Anything that isn't a macro should go straight to the loop
  if (type !== 'macro') doLoop = true

  // Macro stuff doesnt necessarily have to go through the loop
  // if already has done, so we check to see
  if (!doLoop) {
    const macro = yield select(getMacro, p.meta.macroId)
    const node = yield select(getNode, macro.nodeId)

    // Do loop if macro value is false
    if (node.value === false) {
      doLoop = true
    } else {
      // Do loop if last macro id doesnt match this one
      const lastMacroId = yield select(getMacroLastId)

      if (lastMacroId !== p.meta.macroId) {
        doLoop = true
      }
    }
  }

  if (doLoop) {
    for (let i = 0; i < p.values.length; i++) {
      const node = p.values[i]
      yield call(handleNodeValueUpdate, {
        payload: {
          meta: p.meta,
          id: node.id,
          value: node.value
        }
      })
    }

    if (type === 'macro') {
      // Set last macro ID so no need to do loop again for this macro
      yield put(rMacroUpdateLastId(p.meta.macroId))
    }
  }
}

export function* watchMacros () {
  yield takeEvery('U_MACRO_CREATE', macroCreate)
  yield takeEvery('U_MACRO_DELETE', macroDelete)
  yield takeEvery('U_MACRO_TARGET_PARAM_LINK_ADD', macroTargetParamLinkAdd)
  yield takeEvery('U_MACRO_TARGET_PARAM_LINK_DELETE', macroTargetParamLinkDelete)
  yield takeEvery('NODE_VALUE_UPDATE', handleNodeValueUpdate)
  yield takeEvery('NODE_RANGE_UPDATE', handleNodeRangeUpdate)
  yield takeEvery('NODE_VALUES_BATCH_UPDATE', handleNodeValueBatchUpdate)
}
