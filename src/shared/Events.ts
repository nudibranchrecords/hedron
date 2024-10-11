export enum SketchEvents {
  StartSketchesServer = 'start-sketches-server',
  NewSketch = 'new-sketch',
  ReimportSketchModule = 'reimport-sketch-module',
  AddSketchModule = 'add-sketch-module',
  RemoveSketchModule = 'remove-sketch-module',
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
}

type ResponseCanceled = {
  result: 'canceled'
}

type ResponseError = {
  result: 'error'
  error: string
}

type OpenProjectResponseSuccess = {
  result: 'success'
  sketchesDirPath: string
  savePath: string
  projectData: any
}

type SaveProjectResponseSuccess = {
  result: 'success'
  savePath: string
}

export type OpenProjectResponse = OpenProjectResponseSuccess | ResponseError | ResponseCanceled

export type SaveProjectResponse = SaveProjectResponseSuccess | ResponseError | ResponseCanceled

export enum FileWatchEvents {
  change = 'change',
  unlink = 'unlink',
  add = 'add',
}
