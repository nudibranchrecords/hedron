import { useStore } from 'zustand'
import { HedronEngine } from '@hedron/engine/index'
import { EngineStateWithActions } from '@hedron/engine/store/types'

export const engine = new HedronEngine()

export const engineStore = engine.getStore()

export const useEngineStore = <T>(selector?: (state: EngineStateWithActions) => T) => {
  // @ts-expect-error -- might be an issue with zustand...
  return useStore(engineStore, selector!)
}
