import { addNode } from '../shared/addNode'
import { SetterCreator } from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

export const createAddSketch: SetterCreator<'addSketch'> = (setState) => (moduleId: string) => {
  const newSketchId = createUniqueId()
  setState((state) => {
    const { config } = state.sketchModules[moduleId]
    const paramIds = []

    for (const paramConfig of config.params) {
      const id = createUniqueId()
      paramIds.push(id)
      addNode(state, id, newSketchId, paramConfig)
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
