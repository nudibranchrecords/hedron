import { uid } from 'uid'
import { SetterCreator } from '../engineStore'
import { NodeTypes } from '../types'

export const createAddSketch: SetterCreator<'addSketch'> = (setState) => (moduleId: string) => {
  const newId = uid()
  setState((state) => {
    const { title, config } = state.sketchModules[moduleId]
    const paramIds = []

    for (const paramConfig of config.params) {
      const valueType = paramConfig.valueType ?? NodeTypes.Number
      const { key, defaultValue } = paramConfig
      const id = uid()

      paramIds.push(id)

      state.nodes[id] = {
        id,
        key,
        type: 'param' as const,
        valueType,
      }

      if (
        (typeof defaultValue === NodeTypes.Number && valueType === NodeTypes.Number) ||
        (typeof defaultValue === NodeTypes.Boolean && valueType === NodeTypes.Boolean)
      ) {
        state.nodeValues[id] = defaultValue
      } else {
        throw new Error(
          `valueType of param ${paramConfig.key} does not match defaultValue for sketch ${moduleId}`,
        )
      }
    }

    state.sketches[newId] = {
      id: newId,
      moduleId,
      title,
      paramIds,
    }
  })

  return newId
}
