import dispatcher from '../dispatcher';

export function editParam(sketchId, param, value) {


	dispatcher.dispatch( {
		type: 'EDIT_SKETCH_PARAM',
		sketchId,
		param,
		value
	});

}