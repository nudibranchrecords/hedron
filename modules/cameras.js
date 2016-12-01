import {PerspectiveCamera} from 'three';

const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );

camera.position.z = 1000;

export default camera;