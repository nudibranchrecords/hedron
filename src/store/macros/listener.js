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
  rNodeMacroTargetParamLinkDelete,
} from '../nodes/actions'
import { rMacroAdd, rMacroDelete, uMacroTargetParamLinkAdd, rMacroLearningToggle,
  rMacroUpdateLastId, rMacroOpenToggle, rMacroClose,
} from './actions'
import { uiEditingOpen, uiEditingClose } from '../ui/actions'
import { projectError } from '../project/actions'

import uid from 'uid'

const handleMacroCreate = (action, store) => {
  const nodeId = uid()
  store.dispatch(rNodeCreate(nodeId, {
    title: 'New Macro',
    type: 'macro',
    targetParamLinks: {},
    valueType: 'float',
    value: 0,
  }))
  store.dispatch(rMacroAdd(nodeId))
  store.dispatch(rMacroOpenToggle(nodeId))
  store.dispatch(uiEditingOpen('nodeTitle', nodeId))
}

const handleMacroDelete = (action, store) => {
  const state = store.getState()

  const nodeId = action.payload.nodeId
  const node = getNode(state, nodeId)
  store.dispatch(rMacroLearningToggle(false))
  store.dispatch(rMacroDelete(nodeId))
  store.dispatch(uNodeDelete(nodeId))
  store.dispatch(uiEditingClose('nodeTitle', nodeId))
  store.dispatch(rMacroClose(nodeId))

  for (const linkId in node.targetParamLinks) {
    const link = node.targetParamLinks[linkId]
    store.dispatch(uNodeDelete(link.nodeId))
    store.dispatch(rNodeConnectedMacroRemove(link.paramId, nodeId))
  }
}

const handleMacroTargetParamLinkAdd = (action, store) => {
  const state = store.getState()
  const p = action.payload
  const param = getNode(state, p.paramId)
  const nodeId = uid() // a macroTargetParamLink should share most of the properties
  // of the param it is linked to, with a few changes
  store.dispatch(rNodeCreate(nodeId, {
    ...param,
    type: 'macroTargetParamLink',
    value: undefined,
    id: nodeId,
  }))
  store.dispatch(rNodeMacroTargetParamLinkCreate(p.macroId, p.paramId, nodeId))
  store.dispatch(rNodeConnectedMacroAdd(p.paramId, p.macroId))
}

const handleMacroTargetParamLinkDelete = (action, store) => {
  const state = store.getState()
  const p = action.payload
  const link = getMacroTargetParamLink(state, p.macroId, p.paramId)
  store.dispatch(rNodeMacroTargetParamLinkDelete(p.macroId, p.paramId))
  store.dispatch(uNodeDelete(link.nodeId))
  store.dispatch(rNodeConnectedMacroRemove(p.paramId, p.macroId))
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
const macroProcess = (store, p, node) => {
  const state = store.getState()

  const links = node.targetParamLinks
  const keys = Object.keys(links)
  const values = []

  for (let i = 0; i < keys.length; i++) {
    const l = links[keys[i]]
    if (l.startValue === null) {
      const p = getNode(state, l.paramId)
      // Intentionally mutating state here
      l.startValue = p.value
    }
    const n = getNode(state, l.nodeId)
    const val = macroInterpolate(l.startValue, n.value, p.value, n.valueType)
    values.push(
      {
        id: l.paramId,
        value: val,
      }
    )
  }

  store.dispatch(nodeValuesBatchUpdate(values, { type: 'macro', macroId: node.id }))
}

const macroLearnFromParam = (store, p, macroId) => {
  let state = store.getState()
  let link = getMacroTargetParamLink(state, macroId, p.id)

  if (!link) {
    handleMacroTargetParamLinkAdd(uMacroTargetParamLinkAdd(macroId, p.id), store)
    state = store.getState()
    link = getMacroTargetParamLink(state, macroId, p.id)
  }

  store.dispatch(nodeValueUpdate(link.nodeId, p.value))
}

// When a node value is updated, a few things can happen:
// 1. MACRO: Macro is processed
// 2. OTHER VALUE: New param is added to a macro (learning)
// 3. OTHER VALUE: A node value has changed that has macros assigned to it:
//    - The macros assigned to it need to be reset to false
//      (to stop value jumping next time they are used)
//    - If the action has come from a macro, this macro should
//      not be reset to false
const handleNodeValueUpdate = (action, store) => {
  const state = store.getState()
  try {
    const p = action.payload
    const senderType = p.meta && p.meta.type
    const senderMacroId = p.meta && p.meta.macroId

    const node = getNode(state, p.id)

    if (node.type === 'macro') {
      // Normal behaviour, simple process of macro using value of node
      macroProcess(store, p, node)
    } else {
      const isHuman = isInputTypeHuman(senderType)

      if (isHuman) {
        const learningId = getMacroLearningId(state)
        const shouldLearn = shouldItLearn(learningId, node, p)
        if (shouldLearn) {
          macroLearnFromParam(store, p, learningId)
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
              const node = getNode(state, macroId)

              if (node.value !== false) {
                for (const key in node.targetParamLinks) {
                  // Intentionally mutating state here
                  node.targetParamLinks[key].startValue = null
                }

                // Intentionally mutating state here
                node.value = false
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(error)
    store.dispatch(projectError(`Failed to process macro: ${error.message}`))
  }
}

const handleNodeValueBatchUpdate = (action, store) => {
  const state = store.getState()
  const p = action.payload
  let doLoop = false
  const type = p.meta && p.meta.type

  // Anything that isn't a macro should go straight to the loop
  if (type !== 'macro') doLoop = true

  // Macro stuff doesnt necessarily have to go through the loop
  // if already has done, so we check to see
  if (!doLoop) {
    const node = getNode(state, p.meta.macroId)

    // Do loop if macro value is false
    if (node.value === false) {
      doLoop = true
    } else {
      // Do loop if last macro id doesnt match this one
      const lastMacroId = getMacroLastId(state)
      if (lastMacroId !== p.meta.macroId) {
        doLoop = true
      }
    }
  }

  if (doLoop) {
    for (let i = 0; i < p.values.length; i++) {
      const node = p.values[i]
      handleNodeValueUpdate({
        payload: {
          meta: p.meta,
          id: node.id,
          value: node.value,
        },
      }, store)
    }

    if (type === 'macro') {
      // Set last macro ID so no need to do loop again for this macro
      store.dispatch(rMacroUpdateLastId(p.meta.macroId))
    }
  }
}

const macroAddAllForSketch = (store, macroId, sketchId) => {
  const state = store.getState()
  const sketch = getSketch(state, sketchId)

  for (const paramId of sketch.paramIds) {
    const param = getNode(state, paramId)
    const p = {
      id: param.id,
      value: param.value,
    }
    macroLearnFromParam(p, macroId)
  }
}

const handleMacroAddAllForSketch = (action, store) => {
  const state = store.getState()
  const macroId = getMacroLearningId(state)
  const sketchId = getSelectedSketchId(state)
  macroAddAllForSketch(store, macroId, sketchId)
}

const handleMacroAddAllForScene = (action, store) => {
  const state = store.getState()
  const macroId = getMacroLearningId(state)
  const scene = getCurrentScene(state)
  for (const sketchId of scene.sketchIds) {
    macroAddAllForSketch(macroId, sketchId)
  }
}

const actionMap = {
  'U_MACRO_CREATE': handleMacroCreate,
  'U_MACRO_DELETE': handleMacroDelete,
  'U_MACRO_TARGET_PARAM_LINK_ADD': handleMacroTargetParamLinkAdd,
  'U_MACRO_TARGET_PARAM_LINK_DELETE': handleMacroTargetParamLinkDelete,
  'U_MACRO_ADD_ALL_FOR_SKETCH': handleMacroAddAllForSketch,
  'U_MACRO_ADD_ALL_FOR_SCENE': handleMacroAddAllForScene,
  'NODE_VALUE_UPDATE': handleNodeValueUpdate,
  'NODE_VALUES_BATCH_UPDATE': handleNodeValueBatchUpdate,
}

export default (action, store) => {
  const func = actionMap[action.type]
  if (func) func(action, store)
}
