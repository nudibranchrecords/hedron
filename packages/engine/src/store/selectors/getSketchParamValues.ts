import { EngineState, hasChildNodes } from '@store/types'

// Get the values of the parameters of a sketch, dealing with child nodes
export const getSketchParamValues = (state: EngineState, sketchId: string) => {
  const { sketches, paramValues, params } = state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sketchParamValues: { [key: string]: any } = {}
  const sketch = sketches[sketchId]

  sketch.paramIds.forEach((id) => {
    const param = params[id]
    if (!param) return
    const { key } = param

    let value

    if (hasChildNodes(param)) {
      // Return an array of values for nodes with child nodes
      const childNodeIds = param.childNodeIds
      value = childNodeIds.map((childNodeId) => paramValues[childNodeId])
    } else {
      value = paramValues[id]
    }

    sketchParamValues[key] = value
  })

  return sketchParamValues
}
