import { SetterCreator } from '../engineStore'

export const createDeleteSketchModule: SetterCreator<'deleteSketchModule'> =
  (setState) => (moduleId) => {
    setState((state) => {
      delete state.sketchModules[moduleId]
    })
  }
