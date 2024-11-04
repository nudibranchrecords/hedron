import { SetterCreator, NodeTypes } from '@engine/store/types'
import { createUniqueId } from '@engine/utils/createUniqueId'

export const createAddSketch: SetterCreator<'addSketch'> = (setState) => (moduleId: string) => {
  const newSketchId = createUniqueId()
  setState((state) => {
    const { config } = state.sketchModules[moduleId]
    const paramIds = []

    for (const paramConfig of config.params) {
      const valueType = paramConfig.valueType ?? NodeTypes.Number
      const { key, defaultValue } = paramConfig
      const id = createUniqueId()

      paramIds.push(id)

      state.nodes[id] = {
        id,
        key,
        type: 'param' as const,
        valueType,
        sketchId: newSketchId,
      }

      if (
        (typeof defaultValue === 'number' && valueType === NodeTypes.Number) ||
        (typeof defaultValue === 'boolean' && valueType === NodeTypes.Boolean) ||
        (typeof defaultValue === 'string' && valueType === NodeTypes.Enum)
      ) {
        state.nodeValues[id] = defaultValue
      } else {
        throw new Error(
          `valueType of param ${paramConfig.key} does not match defaultValue for sketch ${moduleId}`,
        )
      }
    }

    state.sketches[newSketchId] = {
      id: newSketchId,
      moduleId,
      title: config.title,
      paramIds,
    }
  })

  return newSketchId
}
