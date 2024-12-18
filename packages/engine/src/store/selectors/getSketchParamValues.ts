import { EngineState } from '@store/types'

// Get the values of the parameters of a sketch, dealing with child nodes
export const getSketchParamValues = (state: EngineState, sketchId: string) => {
  const { sketches, nodeValues, nodes } = state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paramValues: { [key: string]: any } = {}
  const sketch = sketches[sketchId]

  sketch.paramIds.forEach((id) => {
    const { key, valueType } = nodes[id]

    let value

    if (valueType === 'vector3' || valueType === 'rgb') {
      // Return an array of values for vector3 and rgb
      const childNodeIds = nodes[id].childNodeIds
      value = childNodeIds.map((childNodeId) => nodeValues[childNodeId])
    } else {
      value = nodeValues[id]
    }

    paramValues[key] = value
  })

  return paramValues
}
