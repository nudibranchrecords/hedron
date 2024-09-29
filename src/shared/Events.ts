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

type ProjectFileDialogResponseSuccess = {
  result: 'success'
  sketchesDirPath: string
  projectData: any
}

type ProjectFileDialogResponseCancelled = {
  result: 'cancelled'
}

interface ProjectFileDialogResponseError {
  result: 'error'
  error: string
}

export type OpenProjectFileDialogResponse =
  | ProjectFileDialogResponseSuccess
  | ProjectFileDialogResponseError
  | ProjectFileDialogResponseCancelled

export enum FileWatchEvents {
  change = 'change',
  unlink = 'unlink',
  add = 'add',
}
