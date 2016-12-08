import renderer from './renderer';
import scene from './scenes';
import camera from './cameras';

import AudioInputs from '../inputs/AudioInputs';

import sketches from './sketches';

function update() {

	requestAnimationFrame( update );

	AudioInputs.update();
	sketches.update();

	renderer.render( scene, camera );

}

update();