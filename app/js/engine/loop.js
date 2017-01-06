import Stats from 'stats.js';

import SketchesStore from '../stores/SketchesStore';

import renderer from './renderer';
import scene from './scenes';
import camera from './cameras';

import Inputs from '../inputs/Inputs';
import Clock from '../inputs/Clock';

import sketches from './sketches';

const stats = new Stats();
stats.dom.setAttribute('style', '');
document.querySelector('#stats').appendChild( stats.dom );

function update() {

	stats.begin();

	Inputs.update();
	sketches.update();

	renderer.render( scene, camera );

	stats.end();

	requestAnimationFrame( update );

}


SketchesStore.on('init', () => {

	sketches.init();
	requestAnimationFrame( update );
	
})
