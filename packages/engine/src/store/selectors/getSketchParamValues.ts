import { EngineState, isParamVector, ParamValue } from '@store/types'

// Get the values of the parameters of a sketch, dealing with child nodes
export const getSketchParamValues = (
  state: EngineState,
  sketchId: string,
  config: { resourcesUrl: string | null },
) => {
  const { sketches, paramValues, nodes } = state
  const sketchParamValues: Record<string, ParamValue | (ParamValue | undefined)[] | undefined> = {}
  const sketch = sketches[sketchId]

  sketch.nodeIds.forEach((id) => {
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
        if (config.resourcesUrl) {
          value = `${config.resourcesUrl}/${value}`
        }
      }
    }

    sketchParamValues[key] = value
  })

  return sketchParamValues
}
