import { SketchModuleItem } from '../types'
import { useAppStore } from '../useAppStore'

export const setSketchModuleItem = (newItem: SketchModuleItem) => {
  useAppStore.setState((state) => ({
    sketchModules: {
      ...state.sketchModules,
      [newItem.moduleId]: newItem,
    },
  }))
}
