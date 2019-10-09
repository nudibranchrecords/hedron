import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as postprocessing from 'postprocessing'
import glslify from 'glslify'
import TWEEN from '@tweenjs/tween.js'

window.HEDRON = {
  // Third party dependencies exposed globally for sketch development
  dependencies: {
    // Declaring THREE as a global var, so that sketches can use the same instance of three.js as Hedron does
    // This keeps the library versions matched and also prevents strange things from happening when the library
    // code is being read from different sources
    THREE: {
      ...THREE,
      // For convenience, also requiring some common three extras
      GLTFLoader,
      OrbitControls,
    },
    // No need for any sketch developer to call TWEEN.update() if using this reference
    TWEEN,
    // Other useful libraries
    postprocessing,
    glslify,
  },
}
