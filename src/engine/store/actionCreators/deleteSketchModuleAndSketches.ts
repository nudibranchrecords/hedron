import { SetterCreator } from '../engineStore'
import { getSketchesOfModuleId } from '../selectors/getSketchesOfModuleId'

export const createDeleteSketchModuleAndSketches: SetterCreator<'deleteSketchModuleAndSketches'> =
  (setState) => (moduleId) => {
    setState((state) => {
      delete state.sketchModules[moduleId]

      const sketchesToDelete = getSketchesOfModuleId(state, moduleId)

      for (const sketch of sketchesToDelete) {
        state.deleteSketch(sketch.id)
      }
    })
  }
