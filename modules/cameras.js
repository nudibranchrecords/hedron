var THREE = require( 'three' );
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );

camera.position.z = 1000;

module.exports = camera;