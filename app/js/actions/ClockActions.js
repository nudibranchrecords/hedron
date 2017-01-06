import dispatcher from '../dispatcher';

export function addBeat() {

	dispatcher.dispatch( {
		type: 'ADD_CLOCK_BEAT'
	});

}