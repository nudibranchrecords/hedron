import { FileEvents, SketchesServerResponse, SketchEvents } from 'src/shared/Events'

export const openSketchesDirDialog = () =>
  new Promise<string | undefined>((resolve) => {
    window.electron.ipcRenderer.invoke(FileEvents.OpenSketchesDirDialog).then((sketchesDirPath) => {
      resolve(sketchesDirPath)
    })
  })

export const startSketchesServer = (sketchesDirPath: string) =>
  new Promise<SketchesServerResponse>((resolve) => {
    window.electron.ipcRenderer
      .invoke(SketchEvents.StartSketchesServer, sketchesDirPath)
      .then((response) => {
        console.log(response)
        resolve(response)
      })
  })
