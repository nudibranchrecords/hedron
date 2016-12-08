import {PerspectiveCamera} from 'three';
import renderer from './renderer';

let width = renderer.domElement.offsetWidth;
let height = renderer.domElement.offsetHeight;

const camera = new PerspectiveCamera( 75, width/height, 0.1, 10000 );

camera.position.z = 1000;

export default camera;