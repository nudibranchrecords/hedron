import Stats from 'stats.js';

import renderer from './renderer';
import scene from './scenes';
import camera from './cameras';

import AudioInputs from '../inputs/AudioInputs';

import sketches from './sketches';

const stats = new Stats();
stats.dom.setAttribute('style', '');
document.querySelector('#stats').appendChild( stats.dom );

function update() {

	stats.begin();

	AudioInputs.update();
	sketches.update();

	renderer.render( scene, camera );

	stats.end();

	requestAnimationFrame( update );

}

requestAnimationFrame( update );