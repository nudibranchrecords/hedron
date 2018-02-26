import { ipcRenderer } from 'electron'
import { projectSave, projectSaveAs, projectLoad } from '../store/project/actions'

let dispatch

export const initiateMenuHandler = (injectedStore) => {
  dispatch = injectedStore.dispatch
}

ipcRenderer.on('app-menu-click', (e, id, ...args) => {
  switch (id) {
    case 'project-save':
      dispatch(projectSave())
      break
    case 'project-save-as':
      dispatch(projectSaveAs())
      break
    case 'project-load':
      dispatch(projectLoad())
      break
  }
})
