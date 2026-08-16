import { getSketch } from './getSceneSketches'
import { EngineState, isParamVector, ParamValue } from '@store/types'

// Get the values of the parameters of a sketch, dealing with child nodes
export const getSketchParamValues = (
  state: EngineState,
  sketchId: string,
  config: { resourcesUrl: string | null },
) => {
  const { paramValues, nodes } = state
  const sketchParamValues: Record<string, ParamValue | (ParamValue | undefined)[] | undefined> = {}
  const sketch = getSketch(state, sketchId)

  if (!sketch) {
    return sketchParamValues
  }

  sketch.childGroups.nodeIds.forEach((id) => {
    const node = nodes[id]

    if (node?.nodeType !== 'param') {
      return
    }

    const { key } = node

    let value: ParamValue | (ParamValue | undefined)[] | undefined

    if (isParamVector(node)) {
      // Return an array of values for nodes with child nodes
      const childNodeIds = node.childGroups.vectorComponentIds
      value = childNodeIds.map((childNodeId) => paramValues[childNodeId])
    } else {
      value = paramValues[id]
    }

    switch (node.valueType) {
      case 'file': {
        const prefix = config.resourcesUrl ? `${config.resourcesUrl}/` : ''
        const filePath = state.resources[value as string]?.filePath
        value = `${prefix}${filePath}`
      }
    }

    sketchParamValues[key] = value
  })

  return sketchParamValues
}
