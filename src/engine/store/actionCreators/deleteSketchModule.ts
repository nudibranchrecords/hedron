import { SetterCreator } from '@engine/store/types'

export const createDeleteSketchModule: SetterCreator<'deleteSketchModule'> =
  (setState) => (moduleId) => {
    setState((state) => {
      delete state.sketchModules[moduleId]
    })
  }
