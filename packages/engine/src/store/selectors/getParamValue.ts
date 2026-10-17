import { EngineState, isParamVector, ParamValue } from '@store/types'

export const getParamValue = (state: EngineState, paramId: string) => {
  let value: ParamValue | ParamValue[] | undefined

  const node = state.nodes[paramId]
  const paramValues = state.paramValues

  if (!node || node.nodeType !== 'param') {
    return undefined
  }

  if (isParamVector(node)) {
    // Return an array of values for nodes with child nodes
    const childNodeIds = node.childGroups.vectorComponentIds

    value = []

    for (const childNodeId of childNodeIds) {
      const childValue = paramValues[childNodeId]

      if (childValue === undefined) {
        return undefined
      }

      value.push(childValue)
    }
  } else {
    value = paramValues[paramId]
  }

  switch (node.valueType) {
    case 'file': {
      const fileName = value as string | null | undefined

      if (fileName === null) {
        value = null
        break
      }

      if (fileName === undefined) {
        value = undefined
        break
      }

      const prefix = state.resourcesUrl ? `${state.resourcesUrl}/` : ''
      const filePath = state.resources[fileName]?.filePath

      value = filePath ? `${prefix}${filePath}` : null
      break
    }
  }
  return value
}
