import { ipcRenderer } from 'electron'
import { projectSave, projectLoadRequest, projectFilepathUpdate } from '../store/project/actions'

let dispatch

export const initiateMenuHandler = (injectedStore) => {
  dispatch = injectedStore.dispatch
}

ipcRenderer.on('app-menu-click', (e, id, ...args) => {
  switch (id) {
    case 'project-save':
      dispatch(projectSave())
      break
  }
})
