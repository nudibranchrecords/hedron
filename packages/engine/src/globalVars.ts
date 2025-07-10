import * as THREE from 'three'
import * as THREE_WEBGPU from 'three/webgpu'
import * as THREE_TSL from 'three/tsl'
import * as postprocessing from 'postprocessing'
// Third party dependencies exposed globally for sketch development
// Needs to also be exported so can be used by type definition files
export const dependencies = {
  // Declaring THREE as a global var, so that sketches can use the same instance of three.js as Hedron does
  // This keeps the library versions matched and also prevents strange things from happening when the library
  // code is being read from different sources
  THREE,
  THREE_WEBGPU,
  THREE_TSL,
  postprocessing,
}

if (typeof window !== 'undefined') {
  // @ts-expect-error ---
  window.__HEDRON = {
    dependencies,
  }
}

export const globalVarsRef = {
  dependenciesRoot: 'window.__HEDRON.dependencies',
  vars: [
    {
      packageName: 'three',
      varName: 'THREE',
    },
    {
      packageName: 'three/webgpu',
      varName: 'THREE_WEBGPU',
    },
    {
      packageName: 'three/webgpu',
      varName: 'THREE_WEBGPU',
    },
    {
      packageName: 'three/tsl',
      varName: 'THREE_TSL',
    },
    {
      packageName: 'postprocessing',
      varName: 'POSTPROCESSING',
    },
  ],
}
