import renderer from './renderer';
import scene from './scenes';
import camera from './cameras';

import inputs from './inputs';
import sketches from './sketches';

function update() {

	requestAnimationFrame( update );

	inputs.update();
	sketches.update();

	renderer.render( scene, camera );

}

update();