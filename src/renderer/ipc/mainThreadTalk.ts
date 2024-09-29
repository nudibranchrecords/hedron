import {
  DialogEvents,
  OpenProjectFileDialogResponse,
  SketchesServerResponse,
  SketchEvents,
} from 'src/shared/Events'

export const openSketchesDirDialog = () =>
  new Promise<string | undefined>((resolve) => {
    window.electron.ipcRenderer
      .invoke(DialogEvents.OpenSketchesDirDialog)
      .then((sketchesDirPath) => {
        resolve(sketchesDirPath)
      })
  })

export const openProjectFileDialog = () =>
  new Promise<OpenProjectFileDialogResponse>((resolve) => {
    window.electron.ipcRenderer.invoke(DialogEvents.OpenProjectFileDialog).then((response) => {
      resolve(response)
    })
  })

export const saveProjectFileDialog = (projectData: string) =>
  new Promise<void>((resolve) => {
    window.electron.ipcRenderer
      .invoke(DialogEvents.SaveProjectFileDialog, projectData)
      .then((response) => {
        resolve(response)
      })
  })

export const startSketchesServer = (sketchesDirPath: string) =>
  new Promise<SketchesServerResponse>((resolve) => {
    window.electron.ipcRenderer
      .invoke(SketchEvents.StartSketchesServer, sketchesDirPath)
      .then((response) => {
        resolve(response)
      })
  })
