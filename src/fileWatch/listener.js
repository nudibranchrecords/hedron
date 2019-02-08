import chokidar from 'chokidar'
import getSketchesPath from '../selectors/getSketchesPath'
import getAvailableModulesPaths from '../selectors/getAvailableModulesPaths'
import { fileSketchModuleChanged } from './actions'
import getProjectSettings from '../selectors/getProjectSettings'
import path from 'path'

let sketchWatcher

// Hacky way to check if one path is a child of another.
// Wont work for things like "foo/../bar"
// should work for this purpose as all paths are absolute
const isChildPath = (child, parent) => child.includes(`${parent}${path.sep}`)

// Called on new project or new sketch dir
export const handleWatchSketches = (action, store) => {
  const state = store.getState()
  const sketchesPath = getSketchesPath(state)
  const modulePaths = getAvailableModulesPaths(state)

  // Kill old sketch watcher if it existed before
  if (sketchWatcher !== undefined) {
    sketchWatcher.close()
  }

  // Watch for changes in the sketches path
  sketchWatcher = chokidar.watch(sketchesPath, { ignored: ['**/node_modules/**'] }).on('all', (event, changedPath) => {
    const state = store.getState()
    const shouldWatch = getProjectSettings(state).watchSketchesDir

    if (event === 'change' && shouldWatch) {
      // Get the correct module by comparing path of changed file against list of module root paths
      const changedModule = modulePaths.find(module => isChildPath(changedPath, module.filePath))
      if (changedModule) {
        store.dispatch(fileSketchModuleChanged(changedModule.moduleId))
      } else {
        console.warn(`File changed: Could not find related sketch module. Path: ${changedPath}`)
      }
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
