import { useStore } from 'zustand'
import { HedronEngine, EngineStateWithActions } from '@hedron/engine'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { Clock } from '@hedron/clock'

export const performanceMonitor = new Stats()

// TODO: This will eventually be handed to the engine but there's nothing to use it for yet
export const clock = new Clock()

export const engine = new HedronEngine({ performanceMonitor })

export const engineStore = engine.getStore()

export const useEngineStore = <T>(selector?: (state: EngineStateWithActions) => T) => {
  return useStore(engineStore, selector!)
}
