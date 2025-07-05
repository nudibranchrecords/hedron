import * as THREE from 'three/webgpu'
import * as THREE_TSL from 'three/tsl'
import * as postprocessing from 'postprocessing'
// Third party dependencies exposed globally for sketch development
// Needs to also be exported so can be used by type definition files
export const dependencies = {
  // Declaring THREE as a global var, so that sketches can use the same instance of three.js as Hedron does
  // This keeps the library versions matched and also prevents strange things from happening when the library
  // code is being read from different sources
  THREE,
  THREE_TSL,
  postprocessing,
}

// @ts-expect-error ---
window.HEDRON = {
  dependencies,
}
