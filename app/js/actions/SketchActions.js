import dispatcher from '../dispatcher';

export function editSketchParam(id, param, value) {

	dispatcher.dispatch( {
		type: 'EDIT_SKETCH_PARAM',
		id,
		param,
		value
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

export function updateSketchParamInput(id, param, inputId) {

	dispatcher.dispatch({
		type: 'UPDATE_SKETCH_PARAM_INPUT',
		id, 
		param, 
		inputId
	});

}