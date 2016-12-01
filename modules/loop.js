import renderer from './renderer';
import sketches from './sketches';
import scene from './scenes';
import camera from './cameras';
import inputs from './inputs';

function render() {

	requestAnimationFrame( render );

	inputs.update();
	sketches.update();
	renderer.render( scene, camera );

}

render();