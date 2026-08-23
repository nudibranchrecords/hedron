import { EngineState, isParamVector, ParamValue } from '@store/types'

export const getParamValue = (
  state: EngineState,
  paramId: string,
  config: { resourcesUrl: string | null },
) => {
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
      const prefix = config.resourcesUrl ? `${config.resourcesUrl}/` : ''
      const filePath = state.resources[value as string]?.filePath
      value = `${prefix}${filePath}`
    }
  }
  return value
}
