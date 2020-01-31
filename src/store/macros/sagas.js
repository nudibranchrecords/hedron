import { select, put, call, takeEvery } from 'redux-saga/effects'
import getNode from '../../selectors/getNode'
import getSketch from '../../selectors/getSketch'
import { shouldItLearn } from './utils'
import getMacroLearningId from '../../selectors/getMacroLearningId'
import getMacroTargetParamLink from '../../selectors/getMacroTargetParamLink'
import getMacroLastId from '../../selectors/getMacroLastId'
import getSelectedSketchId from '../../selectors/getSelectedSketchId'
import getCurrentScene from '../../selectors/getCurrentScene'
import macroInterpolate from '../../utils/macroInterpolate'
import isInputTypeHuman from '../../utils/isInputTypeHuman'
import { rNodeCreate, nodeValueUpdate, uNodeDelete, rNodeConnectedMacroAdd,
  rNodeConnectedMacroRemove, nodeValuesBatchUpdate, rNodeMacroTargetParamLinkCreate,
  rNodeMacroTargetParamLinkDelete, rNodeMacroTargetParamLinkUpdateStartValue,
} from '../nodes/actions'
import { rMacroAdd, rMacroDelete, uMacroTargetParamLinkAdd, rMacroLearningToggle,
  rMacroUpdateLastId, rMacroOpenToggle,
} from './actions'
import { uiEditingOpen } from '../ui/actions'
import { projectError } from '../project/actions'

import uid from 'uid'

export function* macroCreate (action) {
  const nodeId = yield call(uid)
  yield put(rNodeCreate(nodeId, {
    title: 'New Macro',
    type: 'macro',
    targetParamLinks: {},
    valueType: 'float',
    value: 0,
  }))
  yield put(rMacroAdd(nodeId))
  yield put(rMacroOpenToggle(nodeId))
  yield put(uiEditingOpen('nodeTitle', nodeId))
}

export function* macroDelete (action) {
  const nodeId = action.payload.nodeId
  const node = yield select(getNode, nodeId)
  yield put(rMacroLearningToggle(false))
  yield put(rMacroDelete(nodeId))
  yield put(uNodeDelete(nodeId))

  for (const linkId in node.targetParamLinks) {
    const link = node.targetParamLinks[linkId]
    yield put(uNodeDelete(link.nodeId))
    yield put(rNodeConnectedMacroRemove(link.paramId, nodeId))
  }
}

export function* macroTargetParamLinkAdd (action) {
  const p = action.payload
  const param = yield select(getNode, p.paramId)
  const nodeId = yield call(uid)
  // a macroTargetParamLink should share most of the properties
  // of the param it is linked to, with a few changes
  yield put(rNodeCreate(nodeId, {
    ...param,
    type: 'macroTargetParamLink',
    value: undefined,
    id: nodeId,
  }))
  yield put(rNodeMacroTargetParamLinkCreate(p.macroId, p.paramId, nodeId))
  yield put(rNodeConnectedMacroAdd(p.paramId, p.macroId))
}

export function* macroTargetParamLinkDelete (action) {
  const p = action.payload
  const link = yield select(getMacroTargetParamLink, p.macroId, p.paramId)
  yield put(rNodeMacroTargetParamLinkDelete(p.macroId, p.paramId))
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
  const links = node.targetParamLinks
  const keys = Object.keys(links)
  const values = []

  for (let i = 0; i < keys.length; i++) {
    const l = links[keys[i]]
    let startValue = l.startValue
    if (startValue === null) {
      const p = yield select(getNode, l.paramId)
      startValue = p.value
      yield put(rNodeMacroTargetParamLinkUpdateStartValue(node.id, l.paramId, startValue))
    }
    const n = yield select(getNode, l.nodeId)
    const val = yield call(macroInterpolate, startValue, n.value, p.value, n.valueType)
    values.push(
      {
        id: l.paramId,
        value: val,
      }
    )
  }

  yield put(nodeValuesBatchUpdate(values, { type: 'macro', macroId: node.id }))
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
              const node = yield select(getNode, macroId)

              if (node.value !== false) {
                for (const key in node.targetParamLinks) {
                  yield put(rNodeMacroTargetParamLinkUpdateStartValue(macroId, key, null))
                }

                yield put(nodeValueUpdate(macroId, false, { type: 'macro' }))
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

export function* handleNodeValueBatchUpdate (action) {
  const p = action.payload
  let doLoop = false
  const type = p.meta && p.meta.type

  // Anything that isn't a macro should go straight to the loop
  if (type !== 'macro') doLoop = true

  // Macro stuff doesnt necessarily have to go through the loop
  // if already has done, so we check to see
  if (!doLoop) {
    const node = yield select(getNode, p.meta.macroId)

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
          value: node.value,
        },
      })
    }

    if (type === 'macro') {
      // Set last macro ID so no need to do loop again for this macro
      yield put(rMacroUpdateLastId(p.meta.macroId))
    }
  }
}

export function* macroAddAllForSketch (macroId, sketchId) {
  const sketch = yield select(getSketch, sketchId)

  for (const paramId of sketch.paramIds) {
    const param = yield select(getNode, paramId)
    const p = {
      id: param.id,
      value: param.value,
    }
    yield call(macroLearnFromParam, p, macroId)
  }
}

export function* handleMacroAddAllForSketch () {
  const macroId = yield select(getMacroLearningId)
  const sketchId = yield select(getSelectedSketchId)

  yield call(macroAddAllForSketch, macroId, sketchId)
}

export function* handleMacroAddAllForScene () {
  const macroId = yield select(getMacroLearningId)
  const scene = yield select(getCurrentScene)

  for (const sketchId of scene.sketchIds) {
    yield call(macroAddAllForSketch, macroId, sketchId)
  }
}

export function* watchMacros () {
  yield takeEvery('U_MACRO_CREATE', macroCreate)
  yield takeEvery('U_MACRO_DELETE', macroDelete)
  yield takeEvery('U_MACRO_TARGET_PARAM_LINK_ADD', macroTargetParamLinkAdd)
  yield takeEvery('U_MACRO_TARGET_PARAM_LINK_DELETE', macroTargetParamLinkDelete)
  yield takeEvery('U_MACRO_ADD_ALL_FOR_SKETCH', handleMacroAddAllForSketch)
  yield takeEvery('U_MACRO_ADD_ALL_FOR_SCENE', handleMacroAddAllForScene)
  yield takeEvery('NODE_VALUE_UPDATE', handleNodeValueUpdate)
  yield takeEvery('NODE_VALUES_BATCH_UPDATE', handleNodeValueBatchUpdate)
}
