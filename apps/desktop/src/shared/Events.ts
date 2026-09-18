import { Resource } from '@hedron-gl/engine'
import { ProjectData } from './types'

export enum SketchEvents {
  StartSketchesServer = 'start-sketches-server',
  NewSketch = 'new-sketch',
  ReimportSketchModule = 'reimport-sketch-module',
  AddSketchModule = 'add-sketch-module',
  RemoveSketchModule = 'remove-sketch-module',
  BuildResult = 'build-result',
}

export interface SketchesServerResponse {
  moduleIds: string[]
  url: string
}

export enum AppMenuEvents {
  AppMenuClick = 'app-menu-click',
}

export enum AppMenuEventsItem {
  Save = 'save',
  SaveAs = 'save-as',
  Load = 'load',
}

export enum ScreenEvents {
  SendOutput = 'send-output',
  UpdateDisplays = 'update-displays',
}

export enum DialogEvents {
  OpenSketchesDirDialog = 'open-sketches-dir-dialog',
  OpenProjectFileDialog = 'open-project-file-dialog',
  SaveProjectFileDialog = 'save-project-file-dialog',
}

export enum FileEvents {
  SaveProject = 'save-project',
  OpenFolder = 'open-folder',
  OpenSketchSourceFile = 'open-sketch-source-file',
}

type ResponseCanceled = {
  result: 'canceled'
}

type ResponseError = {
  result: 'error'
  error: string
}

type OpenSketchesDirResponseSuccess = {
  result: 'success'
  sketchesDirAbsolute: string
  resourcesDirAbsolute: string
}

type OpenProjectResponseSuccess = {
  result: 'success'
  sketchesDirAbsolute: string
  resourcesDirAbsolute: string
  savePath: string
  projectData: ProjectData
}

type SaveProjectResponseSuccess = {
  result: 'success'
  savePath: string
  fileName: string
  fileNameWithoutExt: string
}

export type OpenProjectResponse = OpenProjectResponseSuccess | ResponseError | ResponseCanceled

export type OpenSketchesDirResponse =
  | OpenSketchesDirResponseSuccess
  | ResponseError
  | ResponseCanceled

export type SaveProjectResponse = SaveProjectResponseSuccess | ResponseError | ResponseCanceled

export enum FileWatchEvents {
  change = 'change',
  unlink = 'unlink',
  add = 'add',
  buildResult = 'buildResult',
}

export enum ResourceEvents {
  StartResourcesServer = 'start-resources-server',
  AddResourceFile = 'add-resource-file',
  RemoveResourceFile = 'remove-resource-file',
  ChangeResourceFile = 'change-resource-file',
}

export interface ResourcesServerResponse {
  files: Record<string, Resource>
  url: string | null
}
