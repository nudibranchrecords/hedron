import renderer from './renderer';
import scene from './scenes';
import camera from './cameras';

import inputs from './inputs';

import dispatcher from '../dispatcher';

function update() {

	requestAnimationFrame( update );

	inputs.update();

	dispatcher.dispatch({
		type: 'UPDATE_SKETCHES'
	});

	renderer.render( scene, camera );

}

update();