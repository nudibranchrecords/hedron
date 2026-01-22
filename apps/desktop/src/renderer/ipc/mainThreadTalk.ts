import { ProjectData } from '@hedron/app-store'
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
    window.electronApi.ipcRenderer
      .invoke(DialogEvents.OpenSketchesDirDialog)
      .then((sketchesDirPath) => {
        resolve(sketchesDirPath)
      })
  })

export const openProjectFileDialog = (projectPath?: string | null) =>
  new Promise<OpenProjectResponse>((resolve) => {
    window.electronApi.ipcRenderer
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
    window.electronApi.ipcRenderer
      .invoke(FileEvents.SaveProject, projectData, options.savePath)
      .then((response) => {
        resolve(response)
      })
  })

export const openFolder = (folderPath: string) =>
  new Promise<{ success: boolean; error?: string }>((resolve) => {
    window.electronApi.ipcRenderer.invoke(FileEvents.OpenFolder, folderPath).then((response) => {
      resolve(response)
    })
  })

export const startSketchesServer = (sketchesDirPath: string) =>
  new Promise<SketchesServerResponse>((resolve) => {
    window.electronApi.ipcRenderer
      .invoke(SketchEvents.StartSketchesServer, sketchesDirPath)
      .then((response) => {
        resolve(response)
      })
  })
