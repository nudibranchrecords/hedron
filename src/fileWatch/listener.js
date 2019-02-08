import chokidar from 'chokidar'
import getSketchesPath from '../selectors/getSketchesPath'
import getAvailableModulesPaths from '../selectors/getAvailableModulesPaths'
import { fileSketchModuleChanged } from './actions'
import getProjectSettings from '../selectors/getProjectSettings'

let sketchWatcher

export const handleWatchSketches = (action, store) => {
  const state = store.getState()
  const path = getSketchesPath(state)
  const modulePaths = getAvailableModulesPaths(state)

  if (sketchWatcher !== undefined) {
    sketchWatcher.close()
  }

  sketchWatcher = chokidar.watch(path, { ignored: 'node_modules' }).on('all', (event, path) => {
    const state = store.getState()
    const shouldWatch = getProjectSettings(state).watchSketchesDir

    if (event === 'change' && shouldWatch) {
      const changedModule = modulePaths.find(module => path.includes(module.filePath))
      store.dispatch(fileSketchModuleChanged(changedModule.moduleId))
    }
  })
}

export default (action, store) => {
  switch (action.type) {
    case 'PROJECT_LOAD_SUCCESS':
      handleWatchSketches(action, store)
      break
  }
}
