import {
  FileEvents,
  ProjectFileDialogResponse,
  SketchesServerResponse,
  SketchEvents,
} from 'src/shared/Events'

export const openSketchesDirDialog = () =>
  new Promise<string | undefined>((resolve) => {
    window.electron.ipcRenderer.invoke(FileEvents.OpenSketchesDirDialog).then((sketchesDirPath) => {
      resolve(sketchesDirPath)
    })
  })

export const openProjectFileDialog = () =>
  new Promise<ProjectFileDialogResponse>((resolve) => {
    window.electron.ipcRenderer.invoke(FileEvents.OpenProjectFileDialog).then((response) => {
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
