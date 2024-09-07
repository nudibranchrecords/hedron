import { SetterCreator } from '../store'

export const createSetSketchModuleItem: SetterCreator<'setSketchModuleItem'> =
  (setState) => (newItem) => {
    setState((state) => ({
      sketchModules: {
        ...state.sketchModules,
        [newItem.moduleId]: newItem,
      },
    }))
  }
