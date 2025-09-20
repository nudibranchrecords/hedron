import * as THREE from 'three'
import * as THREE_WEBGPU from 'three/webgpu'
import * as THREE_TSL from 'three/tsl'
import * as POSTPROCESSING from 'postprocessing'
import './hedronTypes' // Import type declarations

/**
  To prevent duplicate instances of three.js being imported, we have to make sure
  sketches have access to the same instance of three.js as Hedron does. We do this by exposing
  them as a global variable for SketchesServer to make use of.

  Sketch authors don't need to worry about this! SketchesServer makes sure that any import declared below
  gets resolved to point to these global instances of the libraries
*/
if (typeof window !== 'undefined') {
  window.__HEDRON = window.__HEDRON || {}
  window.__HEDRON = {
    ...window.__HEDRON,
    dependencies: {
      THREE,
      THREE_WEBGPU,
      THREE_TSL,
      POSTPROCESSING,
    },
  }
}

export interface GlobalEngineVarsRef {
  dependenciesRoot: string
  vars: { packageName: string; varName: string }[]
}

/**
  IMPORTANT: Keep this updated to match the dependencies above.
  This config object is read by SketchesServer to resolve imports.
*/
export const globalVarsRef: GlobalEngineVarsRef = {
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
