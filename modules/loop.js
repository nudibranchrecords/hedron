var THREE = require( 'three' );
var sketches = require( './sketches' );
var scene = require( './scenes' );
var camera = require( './cameras' );
var inputs = require( './inputs' );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

function render() {

	requestAnimationFrame( render );

	inputs.update();
	sketches.update();
	renderer.render( scene, camera );

}

render();