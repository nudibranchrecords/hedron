import { HedronEngine } from 'src/engine'
import { EngineStateWithActions } from 'src/engine/store/types'
import { useStore } from 'zustand'

export const engine = new HedronEngine()

export const engineStore = engine.getStore()

export const useEngineStore = <T>(selector?: (state: EngineStateWithActions) => T) => {
  return useStore(engineStore, selector!)
}
