import { SetterCreator } from '../types'

export const createDeleteSketchModule: SetterCreator<'deleteSketchModule'> =
  (setState) => (moduleId) => {
    setState((state) => {
      delete state.sketchModules[moduleId]
    })
  }
