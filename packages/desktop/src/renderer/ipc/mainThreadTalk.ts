import { ProjectData } from '@shared/types'
import {
  DialogEvents,
  FileEvents,
  OpenProjectResponse,
  SaveProjectResponse,
  SketchesServerResponse,
  SketchEvents,
} from '@shared/Events'

export const openSketchesDirDialog = () =>
  new Promise<string | undefined>((resolve) => {
    window.Electron.ipcRenderer
      .invoke(DialogEvents.OpenSketchesDirDialog)
      .then((sketchesDirPath) => {
        resolve(sketchesDirPath)
      })
  })

export const openProjectFileDialog = (projectPath?: string | null) =>
  new Promise<OpenProjectResponse>((resolve) => {
    window.Electron.ipcRenderer
      .invoke(DialogEvents.OpenProjectFileDialog, projectPath)
      .then((response) => {
        resolve(response)
      })
  })

export const saveProjectFileDialog = (
  projectData: ProjectData,
  options: { savePath: string | null },
) =>
  new Promise<SaveProjectResponse>((resolve) => {
    window.Electron.ipcRenderer
      .invoke(FileEvents.SaveProject, projectData, options.savePath)
      .then((response) => {
        resolve(response)
      })
  })

export const startSketchesServer = (sketchesDirPath: string) =>
  new Promise<SketchesServerResponse>((resolve) => {
    window.Electron.ipcRenderer
      .invoke(SketchEvents.StartSketchesServer, sketchesDirPath)
      .then((response) => {
        resolve(response)
      })
  })
