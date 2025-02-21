import { useStore } from 'zustand'
import { HedronEngine, EngineStateWithActions } from '@hedron/engine'
import Stats from 'three/examples/jsm/libs/stats.module.js'

export const performanceMonitor = new Stats()

export const engine = new HedronEngine({ performanceMonitor })

export const engineStore = engine.getStore()

export const useEngineStore = <T>(selector?: (state: EngineStateWithActions) => T) => {
  return useStore(engineStore, selector!)
}
