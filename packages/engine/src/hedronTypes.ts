import * as THREE from 'three'
import * as THREE_WEBGPU from 'three/webgpu'
import * as THREE_TSL from 'three/tsl'
import * as POSTPROCESSING from 'postprocessing'

/**
 * Type definitions for global Hedron namespace
 */
export interface HedronGlobal {
  dependencies: {
    THREE: typeof THREE
    THREE_WEBGPU: typeof THREE_WEBGPU
    THREE_TSL: typeof THREE_TSL
    POSTPROCESSING: typeof POSTPROCESSING
  }
  fs?: any // fs is only available when running on desktop
}

declare global {
  interface Window {
    __HEDRON: HedronGlobal
  }
}
