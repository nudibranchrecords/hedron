import renderer from './renderer';
import scene from './scenes';
import camera from './cameras';

import dispatcher from '../dispatcher';

function update() {

	requestAnimationFrame( update );

	dispatcher.dispatch({
		type: 'UPDATE_SKETCHES'
	});

	renderer.render( scene, camera );

}

update();