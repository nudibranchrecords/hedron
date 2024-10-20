import { EngineData } from 'src/engine/store/types'
import {
  DialogEvents,
  FileEvents,
  OpenProjectResponse,
  SaveProjectResponse,
  SketchesServerResponse,
  SketchEvents,
} from 'src/shared/Events'
import { ProjectData } from '../../shared/types'

export const openSketchesDirDialog = () =>
  new Promise<string | undefined>((resolve) => {
    window.electron.ipcRenderer
      .invoke(DialogEvents.OpenSketchesDirDialog)
      .then((sketchesDirPath) => {
        resolve(sketchesDirPath)
      })
  })

export const openProjectFileDialog = () =>
  new Promise<OpenProjectResponse>((resolve) => {
    window.electron.ipcRenderer.invoke(DialogEvents.OpenProjectFileDialog).then((response) => {
      resolve(response)
    })
  })

export const saveProjectFileDialog = (
  projectData: ProjectData,
  options: { savePath: string | null },
) =>
  new Promise<SaveProjectResponse>((resolve) => {
    window.electron.ipcRenderer
      .invoke(FileEvents.SaveProject, projectData, options.savePath)
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
