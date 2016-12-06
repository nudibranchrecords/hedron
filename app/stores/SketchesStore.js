import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import scene from '../modules/scenes';

class SketchesStore extends EventEmitter {

	constructor() {

		super();

		const data = require('../../data/demopatch.json');

		this.sketches = {};

		let Sketch, sketch;

		for (const key of Object.keys(data)) {
		   
			// Require and instantiate sketch
			Sketch = require( '../../sketches/' + data[ key ].sketchId );
			sketch = new Sketch();

			// Override sketch defaults with params from data
			sketch.params = Object.assign({}, sketch.defaults, data[key].params);
			sketch.id = data[key].id;
			sketch.sketchId = data[key].sketchId;
			sketch.title = data[key].title;

			this.sketches[sketch.id] = sketch;

			// Add to scene
			scene.add(sketch.mesh);

		}

	}

	getAll() {
		return this.sketches;
	}

	update() {

		for (const key of Object.keys(this.sketches)) {

			this.sketches[ key ].update();

		}

	}

	editParam(sketchId, param, value) {

		this.sketches[sketchId].params[param] = value;
		this.emit('change');

	}

	handleActions(action) {

		switch(action.type) {

			case "UPDATE_SKETCHES":
				this.update();
				break

			case "EDIT_SKETCH_PARAM":
				this.editParam(action.sketchId, action.param, action.value);
				break
		}


	}

}

const sketchesStore = new SketchesStore;

dispatcher.register(sketchesStore.handleActions.bind(sketchesStore));

export default sketchesStore;