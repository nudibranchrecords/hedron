import { EngineData } from '@hedron/engine'

export interface ProjectData {
  version: number
  engine: EngineData
  app: {
    sketchesDir: string
  }
}
