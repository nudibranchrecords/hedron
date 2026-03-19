import { EngineState, isParamVector } from '@store/types'

// Get the values of the parameters of a sketch, dealing with child nodes
export const getSketchParamValues = (state: EngineState, sketchId: string) => {
  const { sketches, nodeValues, nodes } = state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paramValues: { [key: string]: any } = {}
  const sketch = sketches[sketchId]

  sketch.nodeIds.forEach((id) => {
    const node = nodes[id]

    if (node?.nodeType !== 'param') {
      return
    }

    const { key } = node

    let value

    if (isParamVector(node)) {
      // Return an array of values for nodes with child nodes
      const childNodeIds = node.vectorComponentIds
      value = childNodeIds.map((childNodeId) => nodeValues[childNodeId])
    } else {
      value = nodeValues[id]
    }

    paramValues[key] = value
  })

  return paramValues
}
