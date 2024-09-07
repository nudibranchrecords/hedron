import { uid } from 'uid'
import { SetterCreator } from '../engineStore'

export const createAddSketch: SetterCreator<'addSketch'> = (setState) => (moduleId: string) => {
  const newId = uid()
  setState((state) => {
    const { title, config } = state.sketchModules[moduleId]
    const paramIds = []

    for (const paramConfig of config.params) {
      const valueType = paramConfig.valueType ?? 'number'
      const { key, title, defaultValue } = paramConfig
      const id = uid()

      paramIds.push(id)

      state.nodes[id] = {
        id,
        key,
        title,
        type: 'param' as const,
        valueType,
      }

      if (
        (typeof defaultValue === 'number' && valueType === 'number') ||
        (typeof defaultValue === 'boolean' && valueType === 'boolean')
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
