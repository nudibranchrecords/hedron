import { addNode } from '@store/shared/addNode'
import { SetterCreator } from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

export const createAddSketch: SetterCreator<'addSketch'> = (setState) => (moduleId: string) => {
  const newSketchId = createUniqueId()
  setState((state) => {
    const { config } = state.sketchModules[moduleId]
    const nodeIds = []

    for (const nodeConfig of config.nodes) {
      const id = createUniqueId()
      nodeIds.push(id)
      addNode(state, id, nodeConfig)
    }

    state.sketches[newSketchId] = {
      id: newSketchId,
      moduleId,
      title: config.title,
      nodeIds,
    }
  })

  return newSketchId
}
