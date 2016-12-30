import dispatcher from '../dispatcher';

export function initDisplay() {

	dispatcher.dispatch( {
		type: 'INIT_DISPLAY'
	});

}