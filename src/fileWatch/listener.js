import chokidar from 'chokidar'
import getSketchesPath from '../selectors/getSketchesPath'
import getAvailableModulesPaths from '../selectors/getAvailableModulesPaths'
import { fileSketchModuleChanged, fileSketchConfigChanged } from './actions'
import getProjectSettings from '../selectors/getProjectSettings'
import path from 'path'

let sketchWatcher

// Hacky way to check if one path is a child of another.
// Wont work for things like "foo/../bar"
// should work for this purpose as all paths are absolute
const isChildPath = (child, parent) => child.includes(`${parent}${path.sep}`)

// Check if the file that changed was the top level config for that sketch
const isConfig = (child, parent) => child === `${parent}${path.sep}config.js`

const stopSketchesWatcher = () => {
  if (sketchWatcher !== undefined) {
    sketchWatcher.close()
  }
}

const startSketchesWatcher = (store) => {
  // Kill old sketch watcher if it existed before
  stopSketchesWatcher()

  const state = store.getState()
  const sketchesPath = getSketchesPath(state)
  const modulePaths = getAvailableModulesPaths(state)

  // Kill old sketch watcher if it existed before
  if (sketchWatcher !== undefined) {
    sketchWatcher.close()
  }

  // Watch for changes in the sketches path
  sketchWatcher = chokidar.watch(sketchesPath, { ignored: ['**/node_modules/**'] }).on('all', (event, changedPath) => {
    if (event === 'change') {
      // Get the correct module by comparing path of changed file against list of module root paths
      const changedModule = modulePaths.find(module => isChildPath(changedPath, module.filePath))
      if (changedModule) {
        console.warn(
          `%cHEDRON: Sketch file changed!\n%cModule: ${changedModule.moduleId}\nPath: ${changedPath}`,
          `font-weight: bold`,
          `font-weight: normal`,
        )
        // If its a config file that has changed, reload the params/sketches too
        if (isConfig(changedPath, changedModule.filePath)) {
          store.dispatch(fileSketchConfigChanged(changedModule.moduleId))
        }

        store.dispatch(fileSketchModuleChanged(changedModule.moduleId))
      } else {
        console.error(`File changed: Could not find related sketch module. Path: ${changedPath}`)
      }
    }
  })
}

// start/stop watcher depending on newly loaded project / change of sketches folder
export const handleWatchSketches = (action, store) => {
  const state = store.getState()
  const shouldWatch = getProjectSettings(state).watchSketchesDir

  if (shouldWatch) {
    startSketchesWatcher(store)
  } else {
    stopSketchesWatcher()
  }
}

// start/stop watcher depending on settings
export const handleSettingsChange = (action, store) => {
  const shouldWatchSketches = action.payload.items.watchSketchesDir

  if (shouldWatchSketches) {
    startSketchesWatcher(store)
  } else {
    stopSketchesWatcher()
  }
}

export default (action, store) => {
  switch (action.type) {
    case 'PROJECT_LOAD_SUCCESS':
      handleWatchSketches(action, store)
      break
  }

  switch (action.type) {
    case 'SETTINGS_UPDATE':
      handleSettingsChange(action, store)
      break
  }
}
