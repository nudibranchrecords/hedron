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