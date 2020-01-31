import { getAssignedLinks } from './selectors'
import { nodeValuesBatchUpdate } from '../nodes/actions'
import getNodes from '../../selectors/getNodes'
import getNode from '../../selectors/getNode'
import getNodesValues from '../../selectors/getNodesValues'
import { work } from '../../externals/modifiers'
import debounceInput from '../../utils/debounceInput'
import { getType } from '../../valueTypes'

const handleInputFired = (action, store) => {
  const p = action.payload
  const inputType = p.meta && p.meta.type
  const messageCount = debounceInput(p)

  if (messageCount) {
    const state = store.getState()
    const links = getAssignedLinks(state, p.inputId)
    const values = []

    for (let i = 0; i < links.length; i++) {
      const inputLink = links[i]
      const node = getNode(state, inputLink.nodeId)

      if (node.type === 'linkableAction') {
        store.dispatch(node.action)
      } else {
        let value = p.value
        let modifiers
        const options = getNodesValues(state, inputLink.optionIds)
        const valueType = getType(node.valueType)

        if (!valueType) {
          throw new Error(`No valueType for node ${node.id}`)
        }

        const valueProcess = valueType && valueType.getValueProcess(inputType)

        if (!valueProcess) {
          throw new Error(`No valueProcess function for ${inputType} input with ${node.valueType} valueType`)
        }

        value = valueProcess({
          node: node,
          inputLink,
          value,
          options,
          messageCount,
          actionPayload: p,
          store,
        })

        if (value !== null && inputLink.modifierIds && inputLink.modifierIds.length) {
          const n = getNode(state, inputLink.nodeId)
          modifiers = getNodes(state, inputLink.modifierIds)
          let vals = []
          for (let j = 0; j < modifiers.length; j++) {
            const m = modifiers[j]
            vals.push(m.value)
            if (!m.passToNext) {
              value = work(m.key, vals, value, n.value)
              value = Math.max(0, Math.min(1, value))
              vals = []
            }
          }
        }

        if (inputLink.nodeType === 'macro' && p.meta && p.meta.noteOn) {
          value = 1
        }

        if (value !== null) {
          values.push({
            id: inputLink.nodeId,
            value,
          })
        }
      }
    }
    if (values.length) {
      store.dispatch(nodeValuesBatchUpdate(values, p.meta))
    }
  }
}

export default (action, store) => {
  switch (action.type) {
    case 'INPUT_FIRED':
      handleInputFired(action, store)
      break
  }
}
