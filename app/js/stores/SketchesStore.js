import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import newId from '../utils/newid';
import storage from '../utils/storage';

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

		this.sketches = {};

		storage.get('sketches', (data) => {

			this.init(data);
			this.emit('change');

		});

	}

	init(data) {

		for (const key of Object.keys(data)) {

			let Sketch, sketch;
		   
			// Require and instantiate sketch
			Sketch = require( '../../../sketches/' + data[ key ].sketchFile );
			sketch = new Sketch();

			// Override sketch defaults with params from data
			sketch.data.params = Object.assign({}, sketch.data.params, data[key].params);
			sketch.data.id = key;
			sketch.data.sketchFile = data[key].sketchFile;
			sketch.data.title = data[key].title;

			// Add param modifiers
			for (const paramKey of Object.keys(sketch.data.params)) {

				if (!data[key].params[paramKey] || !sketch.data.params[paramKey].modifiers) {
					sketch.data.params[paramKey].modifiers = JSON.parse(JSON.stringify(modifierDefaults))
				} else {
					sketch.data.params[paramKey].modifiers = data[key].params[paramKey].modifiers;
				}

			}

			// Add inputs
			sketch.data.inputs = Object.assign({audio:{}, midi:{}}, data[key].inputs);

			this.sketches[sketch.data.id] = sketch;

		}

		this.emit('init');

	}

	saveToFile() {
		let data = {};

		for (const key of Object.keys(this.sketches)) {
			data[key] = this.sketches[key].data;
		}

		storage.set('sketches', data);
	}

	createSketch(sketchFile) {

		let Sketch, sketch;

		// Require and instantiate sketch
		Sketch = require( '../../../sketches/' + sketchFile );
		sketch = new Sketch();

		sketch.data.id = newId('sketch_');
		sketch.data.sketchFile = sketchFile;
		sketch.data.title = sketchFile;

		sketch.data.inputs = {
			audio: {}
		};

		// Add param modifiers
		for (const paramKey of Object.keys(sketch.data.params)) {

			sketch.data.params[paramKey].modifiers = JSON.parse(JSON.stringify(modifierDefaults));
		
		}

		this.sketches[sketch.data.id] = sketch;

		this.emit('change');
		this.emit('create', sketch.data.id);

		window.location.hash = '/sketch/'+sketch.data.id;

	}

	deleteSketch(id) {

		this.emit('change');
		this.emit('delete', id);

		delete this.sketches[id];
	}

	getAll() {
		return this.sketches;
	}

	getParamValue(id, param) {

		return this.sketches[id].data.params[param].value;

	}

	editParam(id, param, value) {

		this.sketches[id].data.params[param].value = Math.round(value * 100)/100;

	}

	editParamInput(id, param, inputType, inputId) {

		let inputs = this.sketches[id].data.inputs[inputType];


		if (!inputs) {
			inputs = this.sketches[id].data.inputs[inputType] = {};
		}

		this.deleteParamInput(id, param);

		// Update the sketch object
		this.sketches[id].data.params[param].input = {
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

		const sketchData = this.sketches[id].data;

		// Delete reference in sketch object
		delete sketchData.params[param].input;
		// Delete if reference in audio inputs
		delete sketchData.inputs.audio[param];
		// Delete any references in midi inputs

		if (sketchData.inputs.midi) {
			for (const key of Object.keys(sketchData.inputs.midi)) {
				if (sketchData.inputs.midi[key].param == param) {
					delete sketchData.inputs.midi[key];
				}
			}
		}
		
		
		this.emit('change');

	}

	editParamModifier(id, param, key, value) {

		let modifier;
		const modifiers = this.sketches[id].data.params[param].modifiers;

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

	editParamModifierInput(id, param, modifierId, inputType, inputId) {

		const sketchData = this.sketches[id].data;
		const modifiers = sketchData.params[param].modifiers;

		const modifier = modifiers.filter(function( obj ) {
		  return obj.id == modifierId;
		})[0];

		let inputs = sketchData.inputs[inputType];

		if (!inputs) {
			inputs = sketchData.inputs[inputType] = {};
		}

		// Update the sketch object
		modifier.input = {
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
			inputs[inputId].modifier = modifierId;

		}
		
		
		this.emit('change');

	}

	deleteParamModifierInput(id, param, modifierId) {

		const sketchData = this.sketches[id].data;
		const modifiers = sketchData.params[param].modifiers;

		const modifier = modifiers.filter(function( obj ) {
		  return obj.id == modifierId;
		})[0];


		// Delete reference in sketch object
		delete modifier.input;

		// Delete any references in midi inputs
		if (sketchData.inputs.midi) {
			for (const key of Object.keys(sketchData.inputs.midi)) {

				if (sketchData.inputs.midi[key].param == param) {

					delete sketchData.inputs.midi[key];
				}
			}
		}
		
		
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

			case 'UPDATE_SKETCH_PARAM_MODIFIER_INPUT':
				this.editParamModifierInput(action.id, action.param, action.modifierId, action.inputType, action.inputId);
				break

			case 'DELETE_SKETCH_PARAM_MODIFIER_INPUT':
				this.deleteParamModifierInput(action.id, action.param, action.modifierId);
				break

			case 'SAVE_SKETCHES_TO_FILE':
				this.saveToFile();
				break
		}


	}

}

const sketchesStore = new SketchesStore;

dispatcher.register(sketchesStore.handleActions.bind(sketchesStore));

export default sketchesStore;