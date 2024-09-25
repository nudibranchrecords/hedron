import { uid } from 'uid'
import { SetterCreator } from '../engineStore'
import { NodeTypes } from '../types'

export const createUpdateSketchParams: SetterCreator<'updateSketchParams'> =
  (setState) => (sketchId: string) => {
    setState((state) => {
      const sketch = state.sketches[sketchId]
      if (!sketch) {
        throw new Error(`Sketch with id ${sketchId} not found.`)
      }

      const moduleId = sketch.moduleId
      const { config } = state.sketchModules[moduleId]

      const existingParamIds = new Set(sketch.paramIds)
      const newParamIds: string[] = []

      // 1. Add new params that are in the new config but not in the current sketch.
      for (const paramConfig of config.params) {
        const valueType = paramConfig.valueType ?? NodeTypes.Number
        const { key, defaultValue } = paramConfig

        // Find existing node for this key, if any.
        let paramId = Array.from(existingParamIds).find((id) => state.nodes[id]?.key === key)

        // If no existing node, create a new one.
        if (!paramId) {
          paramId = uid()
          state.nodes[paramId] = {
            id: paramId,
            key,
            type: 'param' as const,
            valueType,
          }

          // Set the default value if it matches the valueType.
          if (
            (typeof defaultValue === 'number' && valueType === NodeTypes.Number) ||
            (typeof defaultValue === 'boolean' && valueType === NodeTypes.Boolean) ||
            (typeof defaultValue === 'string' && valueType === NodeTypes.Enum)
          ) {
            state.nodeValues[paramId] = defaultValue
          } else {
            throw new Error(
              `valueType of param ${paramConfig.key} does not match defaultValue for sketch ${moduleId}`,
            )
          }
        }

        // Add this paramId to the new list.
        newParamIds.push(paramId)
        existingParamIds.delete(paramId) // Remove from the set of existing IDs, indicating it's still valid.
      }

      // 2. Remove params that are no longer in the new config.
      for (const oldParamId of existingParamIds) {
        delete state.nodes[oldParamId]
        delete state.nodeValues[oldParamId]
      }

      // 3. Update the sketch with the new list of param IDs.
      sketch.paramIds = newParamIds
    })
  }
