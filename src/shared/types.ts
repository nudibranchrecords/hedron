import { EngineData } from '@engine/store/types'
export interface ProjectData {
  version: number
  engine: EngineData
  app: {
    sketchesDir: string
  }
}
