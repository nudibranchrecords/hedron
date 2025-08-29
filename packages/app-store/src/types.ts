import { EngineData } from '@hedron/engine'

export interface ProjectData {
  version: number
  engine: EngineData
  app: {
    sketchesDir: string
    // TODO: activeSketchId should be part of the save state
    // but causing errors when Hedron opens directly on a sketch
    // activeSketchId: string | null
    selectedNodes: { [sketchId: string]: string }
    selectedInputs: { [inputId: string]: string }
    openedParamGroups: { [sketchId: string]: Record<number, boolean> }
  }
}
