import { SetterCreator } from '@engine/store/types'

export const createSetSketchModuleItem: SetterCreator<'setSketchModuleItem'> =
  (setState) => (newItem) => {
    setState((state) => {
      state.sketchModules[newItem.moduleId] = newItem
    })
  }
