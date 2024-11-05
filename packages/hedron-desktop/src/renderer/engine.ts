import { useStore } from 'zustand'
import { HedronEngine } from 'hedron-engine/index'
import { EngineStateWithActions } from 'hedron-engine/store/types'

export const engine = new HedronEngine()

export const engineStore = engine.getStore()

export const useEngineStore = <T>(selector?: (state: EngineStateWithActions) => T) => {
  return useStore(engineStore, selector!)
}
