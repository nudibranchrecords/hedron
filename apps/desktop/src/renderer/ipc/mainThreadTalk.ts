import { ProjectData } from '@hedron-gl/app-store'
import {
  DialogEvents,
  OpenSketchesDirResponse,
  FileEvents,
  OpenProjectResponse,
  ResourceEvents,
  ResourcesServerResponse,
  SaveProjectResponse,
  SketchesServerResponse,
  SketchEvents,
} from '@shared/Events'

export const openSketchesDirDialog = (defaultPath?: string | null) =>
  new Promise<OpenSketchesDirResponse>((resolve) => {
    window.electronApi.ipcRenderer
      .invoke(DialogEvents.OpenSketchesDirDialog, defaultPath ?? undefined)
      .then((response) => {
        resolve(response)
      })
  })

export const openProjectFileDialog = (projectPath?: string | null, defaultPath?: string | null) =>
  new Promise<OpenProjectResponse>((resolve) => {
    window.electronApi.ipcRenderer
      .invoke(DialogEvents.OpenProjectFileDialog, projectPath, defaultPath ?? undefined)
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

export const startResourcesServer = (resourcesDirPath: string) =>
  new Promise<ResourcesServerResponse>((resolve) => {
    window.electronApi.ipcRenderer
      .invoke(ResourceEvents.StartResourcesServer, resourcesDirPath)
      .then((response) => {
        resolve(response)
      })
  })
