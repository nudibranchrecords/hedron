import scene from './scenes';
import inputs from './inputs';

var data = require('../data/demopatch.json')

class Sketches {

	constructor() {

		this.sketches = [];
		let Sketch, sketch;

		for ( let i = 0; i < data.length; i++ ) {

			// Require and instantiate sketch
			Sketch = require( '../sketches/' + data[ i ].id );
			sketch = new Sketch();

			// Override sketch defaults with params from data
			sketch.params = Object.assign({}, sketch.defaults, data[i].params);
			sketch.inputs = data[i].inputs;
			sketch.nodes = data[i].nodes;

			this.sketches.push( sketch );

			inputs.registerSketch(sketch);

		}

		for ( let i = 0; i < this.sketches.length; i++ ) {

			scene.add( this.sketches[ i ].mesh );

		}
	}

	update() {

		for ( let i = 0; i < this.sketches.length; i++ ) {
		
			this.sketches[ i ].update();

		}

	}

}

export default new Sketches;
