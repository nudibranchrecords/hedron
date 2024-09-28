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

export enum ScreenEvents {
  SendOutput = 'send-output',
  UpdateDisplays = 'update-displays',
}

export enum FileEvents {
  OpenSketchesDirDialog = 'open-sketches-dir-dialog',
}

export enum FileWatchEvents {
  change = 'change',
  unlink = 'unlink',
  add = 'add',
}
