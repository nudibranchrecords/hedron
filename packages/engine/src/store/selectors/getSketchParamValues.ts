import { EngineState } from '@store/types'

export const getSketchParamValues = (state: EngineState, sketchId: string) => {
  const { sketches, nodeValues, nodes } = state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paramValues: { [key: string]: any } = {}
  const sketch = sketches[sketchId]

  sketch.paramIds.forEach((id) => {
    const { key, valueType } = nodes[id]

    let value

    if (valueType === 'vector3') {
      const childNodeIds = nodes[id].childNodeIds
      value = childNodeIds.map((childNodeId) => nodeValues[childNodeId])
    } else {
      value = nodeValues[id]
    }

    paramValues[key] = value
  })

  return paramValues
}
