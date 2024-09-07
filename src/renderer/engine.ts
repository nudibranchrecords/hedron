import { HedronEngine } from 'src/engine/HedronEngine'
import { HedronState } from 'src/engine/store/store'
import { useStore } from 'zustand'

export const engine = new HedronEngine()

export const engineStore = engine.getStore()

export const useEngineStore = <T>(selector?: (state: HedronState) => T) => {
  return useStore(engineStore, selector!)
}
