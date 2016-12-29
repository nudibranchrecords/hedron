import {PerspectiveCamera} from 'three';
import renderer from './renderer';

let width = renderer.renderer.domElement.offsetWidth;
let height = renderer.renderer.domElement.offsetHeight;

const camera = new PerspectiveCamera( 75, width/height, 0.1, 10000 );

camera.position.z = 1000;

renderer.on('resized', resize);

function resize() {
	width = renderer.renderer.domElement.offsetWidth;
	height = renderer.renderer.domElement.offsetHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();
}

export default camera;