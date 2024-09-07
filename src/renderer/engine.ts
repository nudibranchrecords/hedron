import { HedronEngine, EngineState } from 'src/engine'
import { useStore } from 'zustand'

export const engine = new HedronEngine()

export const engineStore = engine.getStore()

export const useEngineStore = <T>(selector?: (state: EngineState) => T) => {
  return useStore(engineStore, selector!)
}
