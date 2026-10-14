import { getParamValue } from './getParamValue'
import { getSketch } from './getSceneSketches'
import { EngineState, ParamValue } from '@store/types'

// Get the values of the parameters of a sketch, dealing with child nodes
export const getSketchParamValues = (
  state: EngineState,
  sketchId: string,
  config: { resourcesUrl: string | null },
) => {
  const { nodes } = state
  const sketchParamValues: Record<string, ParamValue | ParamValue[] | undefined> = {}
  const sketch = getSketch(state, sketchId)

  if (!sketch) {
    return sketchParamValues
  }

  sketch.nodeIds.forEach((id) => {
    const node = nodes[id]

    if (node?.nodeType !== 'param') {
      return
    }

    const { key } = node

    const value = getParamValue(state, id, config)

    sketchParamValues[key] = value
  })

  return sketchParamValues
}
