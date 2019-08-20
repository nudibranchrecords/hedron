// Declaring THREE as a global var, so that sketches can use the same instance of three.js as Hedron does
// This keeps the library versions matched and also prevents strange things from happening when two instances of three
// are running at the same time
window.THREE = require('three')

// Other useful libraries
window.POSTPROCESSING = require('postprocessing')
window.GLSLIFY = require('glslify')

// For convenience, also requiring some common three extras
require('three/examples/js/loaders/GLTFLoader')
require('three/examples/js/controls/OrbitControls')
