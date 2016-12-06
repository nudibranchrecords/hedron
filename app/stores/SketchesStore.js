import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import scene from '../modules/scenes';
import newId from '../utils/newid';

class SketchesStore extends EventEmitter {

	constructor() {

		super();

		const data = require('../../data/demopatch.json');

		this.sketches = {};

		for (const key of Object.keys(data)) {

			let Sketch, sketch;
		   
			// Require and instantiate sketch
			Sketch = require( '../../sketches/' + data[ key ].sketchFile );
			sketch = new Sketch();

			// Override sketch defaults with params from data
			sketch.params = Object.assign({}, sketch.defaults, data[key].params);
			sketch.id = key;
			sketch.sketchFile = data[key].sketchFile;
			sketch.title = data[key].title;

			this.sketches[sketch.id] = sketch;

			// Add to scene
			scene.add(sketch.mesh);

		}

	}

	createSketch(sketchFile) {

		let Sketch, sketch;

		// Require and instantiate sketch
		Sketch = require( '../../sketches/' + sketchFile );
		sketch = new Sketch();

		sketch.params = sketch.defaults;
		sketch.id = newId('sketch_');
		sketch.sketchFile = sketchFile;
		sketch.title = sketchFile;

		this.sketches[sketch.id] = sketch;

		// Add to scene
		scene.add(sketch.mesh);

		this.emit('change');

	}

	deleteSketch(id) {

		scene.remove(this.sketches[id].mesh);

		delete this.sketches[id];

		this.emit('change');
	}

	getAll() {
		return this.sketches;
	}

	update() {

		for (const key of Object.keys(this.sketches)) {

			this.sketches[ key ].update();

		}

	}

	editParam(id, param, value) {

		this.sketches[id].params[param] = value;
		this.emit('change');

	}

	handleActions(action) {

		switch(action.type) {

			case "UPDATE_SKETCHES":
				this.update();
				break

			case "EDIT_SKETCH_PARAM":
				this.editParam(action.id, action.param, action.value);
				break

			case "CREATE_SKETCH":
				this.createSketch(action.sketchFile);
				break

			case "DELETE_SKETCH":
				this.deleteSketch(action.id);
				break
		}


	}

}

const sketchesStore = new SketchesStore;

dispatcher.register(sketchesStore.handleActions.bind(sketchesStore));

export default sketchesStore;