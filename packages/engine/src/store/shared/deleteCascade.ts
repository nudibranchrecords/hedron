import { EngineState, hasChildNodes } from '@store/types'

export const deleteInput = (state: EngineState, inputId: string) => {
  const input = state.inputs[inputId]
  if (!input) {
    return
  }

  const optionNodeIds = [...input.optionNodeIds]

  delete state.inputs[inputId]

  for (const optionNodeId of optionNodeIds) {
    deleteNode(state, optionNodeId)
  }
}

export const deleteNode = (state: EngineState, nodeId: string) => {
  const associatedInputIds = Object.values(state.inputs)
    .filter(
      (candidateInput) =>
        candidateInput.targetNodeId === nodeId || candidateInput.optionNodeIds.includes(nodeId),
    )
    .map((candidateInput) => candidateInput.id)

  const node = state.nodes[nodeId]
  if (node) {
    delete state.nodes[nodeId]
    delete state.nodeValues[nodeId]

    if (node.nodeType === 'param' && node.valueType === 'number') {
      delete state.nodes[`${nodeId}-sliderMin`]
      delete state.nodes[`${nodeId}-sliderMax`]
      delete state.nodeValues[`${nodeId}-sliderMin`]
      delete state.nodeValues[`${nodeId}-sliderMax`]
    }

    if (hasChildNodes(node)) {
      for (const childNodeId of node.childNodeIds) {
        deleteNode(state, childNodeId)
      }
    }
  }

  for (const associatedInputId of associatedInputIds) {
    deleteInput(state, associatedInputId)
  }
}
