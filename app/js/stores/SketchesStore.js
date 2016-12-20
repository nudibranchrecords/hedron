import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import newId from '../utils/newid';

const modifierDefaults = [
	{
		'id': 'threshold',
		'm': 0.0
	},
	{
		'id': 'gain',
		'm': 0.5
	},
	{
		'id': 'range',
		'm': 1.0
	},
	{
		'id': 'rangeStart',
		'm': 0.0
	},
	{
		'id': 'bitCrush',
		'm': 0.0
	}
]

class SketchesStore extends EventEmitter {

	constructor() {

		super();

		const data = require('../../../data/demopatch.json');

		this.sketches = {};

		for (const key of Object.keys(data)) {

			let Sketch, sketch;
		   
			// Require and instantiate sketch
			Sketch = require( '../../../sketches/' + data[ key ].sketchFile );
			sketch = new Sketch();

			// Override sketch defaults with params from data
			sketch.params = Object.assign({}, sketch.params, data[key].params);
			sketch.id = key;
			sketch.sketchFile = data[key].sketchFile;
			sketch.title = data[key].title;

			// Add param modifiers
			for (const paramKey of Object.keys(sketch.params)) {

				if (!data[key].params[paramKey] || !sketch.params[paramKey].modifiers) {
					sketch.params[paramKey].modifiers = JSON.parse(JSON.stringify(modifierDefaults))
				} else {
					sketch.params[paramKey].modifiers = data[key].params[paramKey].modifiers;
				}

			}

			// Add inputs & nodes
			sketch.inputs = data[key].inputs;
			sketch.nodes = data[key].nodes;

			this.sketches[sketch.id] = sketch;

		}

	}

	createSketch(sketchFile) {

		let Sketch, sketch;

		// Require and instantiate sketch
		Sketch = require( '../../../sketches/' + sketchFile );
		sketch = new Sketch();

		sketch.id = newId('sketch_');
		sketch.sketchFile = sketchFile;
		sketch.title = sketchFile;

		sketch.inputs = {
			audio: {}
		};

		// Add param modifiers
		for (const paramKey of Object.keys(sketch.params)) {

			sketch.params[paramKey].modifiers = JSON.parse(JSON.stringify(modifierDefaults));
		
		}

		this.sketches[sketch.id] = sketch;

		this.emit('change');
		this.emit('create', sketch.id);

		window.location.hash = '/sketch/'+sketch.id;

	}

	deleteSketch(id) {

		this.emit('change');
		this.emit('delete', id);

		delete this.sketches[id];
	}

	getAll() {
		return this.sketches;
	}


	editParam(id, param, value) {

		this.sketches[id].params[param].value = Math.round(value * 100)/100;
		this.emit('change');

	}

	editParamInput(id, param, inputType, inputId) {

		let inputs = this.sketches[id].inputs[inputType];


		if (!inputs) {
			inputs = this.sketches[id].inputs[inputType] = {};
		}

		this.deleteParamInput(id, param);

		// Update the sketch object
		this.sketches[id].params[param].input = {
			id: inputId, 
			type: inputType
		}


		// Update the inputs object
		if (inputType == 'audio') {

			inputs[param] = inputId;

		} else {

			if (!inputs[inputId]) {
				inputs[inputId] = {}
			}

			inputs[inputId].param = param;

		}
		
		
		this.emit('change');

	}


	deleteParamInput(id, param) {

		const sketch = this.sketches[id];

		// Delete reference in sketch object
		delete sketch.params[param].input;
		// Delete if reference in audio inputs
		delete sketch.inputs.audio[param];
		// Delete any references in midi inputs

		if (sketch.inputs.midi) {
			for (const key of Object.keys(sketch.inputs.midi)) {
				if (sketch.inputs.midi[key].param == param) {
					delete sketch.inputs.midi[key];
				}
			}
		}
		
		
		this.emit('change');

	}

	editParamModifier(id, param, key, value) {

		let modifier;
		const modifiers = this.sketches[id].params[param].modifiers;

		if (typeof(key) === 'number') {

 			modifier = modifiers[key];

		} else if (typeof(key) === 'string') {

			modifier = modifiers.filter(function( obj ) {
			  return obj.id == key;
			})[0];

		}

		modifier.m = value;

		this.emit('change');
	}

	handleActions(action) {

		switch(action.type) {

			case 'EDIT_SKETCH_PARAM':
				this.editParam(action.id, action.param, action.value);
				break

			case 'CREATE_SKETCH':
				this.createSketch(action.sketchFile);
				break

			case 'DELETE_SKETCH':
				this.deleteSketch(action.id);
				break

			case 'UPDATE_SKETCH_PARAM_INPUT':
				this.editParamInput(action.id, action.param, action.inputType, action.inputId);
				break

			case 'DELETE_SKETCH_PARAM_INPUT':
				this.deleteParamInput(action.id, action.param);
				break

			case 'EDIT_SKETCH_PARAM_MODIFIER':
				this.editParamModifier(action.id, action.param, action.modifierIndex, action.value);
				break
		}


	}

}

const sketchesStore = new SketchesStore;

dispatcher.register(sketchesStore.handleActions.bind(sketchesStore));

export default sketchesStore;