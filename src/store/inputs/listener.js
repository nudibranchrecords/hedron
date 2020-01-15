import { getAssignedLinks } from './selectors'
import { nodeValuesBatchUpdate } from '../nodes/actions'
import { projectError } from '../project/actions'
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
    try {
      const state = store.getState()
      const links = getAssignedLinks(state, p.inputId)
      const values = []

      for (let i = 0; i < links.length; i++) {
        const inputLink = links[i]
        const linkNode = getNode(state, inputLink.nodeId)

        if (linkNode.type === 'linkableAction') {
          store.dispatch(linkNode.action)
        } else {
          let value = p.value
          let modifiers
          const options = getNodesValues(state, inputLink.optionIds)
          const valueType = getType(linkNode.valueType)

          const valueProcess = valueType && valueType.getValueProcess(inputType)

          value = valueProcess({
            node: linkNode,
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
    } catch (error) {
      console.error(error)
      store.dispatch(projectError(error.message))
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
