import { useStore } from 'zustand'
import { HedronEngine, EngineStateWithActions } from '@hedron/engine'

export const engine = new HedronEngine()

export const engineStore = engine.getStore()

export const useEngineStore = <T>(selector?: (state: EngineStateWithActions) => T) => {
  return useStore(engineStore, selector!)
}
