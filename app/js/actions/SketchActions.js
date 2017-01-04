import dispatcher from '../dispatcher';

export function editSketchParam(id, param, value) {

	dispatcher.dispatch( {
		type: 'EDIT_SKETCH_PARAM',
		id,
		param,
		value
	});

}

export function toggleSketchParamModifiers(id, param) {

	dispatcher.dispatch( {
		type: 'TOGGLE_SKETCH_PARAM_MODIFIERS',
		id,
		param
	});

}

export function createSketch(sketchFile) {

	dispatcher.dispatch( {
		type: 'CREATE_SKETCH',
		sketchFile
	});

}

export function deleteSketch(id) {

	dispatcher.dispatch( {
		type: 'DELETE_SKETCH',
		id
	});

}

export function updateSketchParamInput(id, param, inputType, inputId, inputParams) {

	dispatcher.dispatch({
		type: 'UPDATE_SKETCH_PARAM_INPUT',
		id, 
		param, 
		inputType,
		inputId,
		inputParams
	});

}

export function updateSketchParamModifierInput(id, param, modifierId, inputType, inputId) {

	dispatcher.dispatch({
		type: 'UPDATE_SKETCH_PARAM_MODIFIER_INPUT',
		id, 
		param, 
		modifierId,
		inputType,
		inputId
	});

}

export function deleteSketchParamModifierInput(id, param, modifierId) {

	dispatcher.dispatch({
		type: 'DELETE_SKETCH_PARAM_MODIFIER_INPUT',
		id, 
		param, 
		modifierId
	});

}

export function deleteSketchParamInput(id, param) {

	dispatcher.dispatch({
		type: 'DELETE_SKETCH_PARAM_INPUT',
		id, 
		param
	});

}

export function editSketchParamModifier(id, param, modifierIndex, value) {

	dispatcher.dispatch({
		type: 'EDIT_SKETCH_PARAM_MODIFIER',
		id, 
		param, 
		modifierIndex,
		value
	});

}

export function saveToFile() {

	dispatcher.dispatch( {
		type: 'SAVE_SKETCHES_TO_FILE'
	});

}