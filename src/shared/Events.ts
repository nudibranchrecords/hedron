export enum SketchEvents {
  InitialSketchModuleIds = 'initial-sketch-module-ids',
  NewSketch = 'new-sketch',
  ReimportSketchModule = 'reimport-sketch-module',
  AddSketchModule = 'add-sketch-module',
  RemoveSketchModule = 'remove-sketch-module',
  ServerStart = 'sketch-server-start',
}

export enum ScreenEvents {
  SendOutput = 'send-output',
  UpdateDisplays = 'update-displays',
}

export enum FileEvents {
  OpenSketchesDirDialog = 'open-sketches-dir-dialog',
  SelectSketchesDir = 'select-sketches-dir',
}
