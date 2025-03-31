import { addParam } from '@store/shared/addParam'
import { addShot } from '@store/shared/addShot'
import { SetterCreator } from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

export const createAddSketch: SetterCreator<'addSketch'> = (setState) => (moduleId: string) => {
  const newSketchId = createUniqueId()
  setState((state) => {
    const { config } = state.sketchModules[moduleId]
    const paramIds = []
    const shotIds = []

    for (const paramConfig of config.params) {
      const id = createUniqueId()
      paramIds.push(id)
      addParam(state, id, newSketchId, paramConfig)
    }

    for (const shotConfig of config.shots) {
      const id = createUniqueId()
      shotIds.push(id)
      addShot(state, id, newSketchId, shotConfig)
    }

    state.sketches[newSketchId] = {
      id: newSketchId,
      moduleId,
      title: config.title,
      paramIds,
      shotIds,
    }
  })

  return newSketchId
}
