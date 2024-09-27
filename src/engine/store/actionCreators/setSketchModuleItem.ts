import { SetterCreator } from '../types'

export const createSetSketchModuleItem: SetterCreator<'setSketchModuleItem'> =
  (setState) => (newItem) => {
    setState((state) => {
      state.sketchModules[newItem.moduleId] = newItem
    })
  }
