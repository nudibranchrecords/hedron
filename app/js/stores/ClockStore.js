import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

class ClockStore extends EventEmitter {

	constructor() {

		super();

		this.bpm = '110';
		this.currentBeat = 1
		this.delta = 0;
		this.mode = 'generated';

	}

	addBeat() {

		this.currentBeat++;

		if (this.currentBeat > 4) {
			this.currentBeat = 1;
		}

		this.emit('change');
	}

	getCurrentBeat() {
		return this.currentBeat;
	}

	setBpm(bpm) {
		this.bpm = bpm;
	}

	getBpm() {
		return this.bpm;
	}

	handleActions(action) {

		switch(action.type) {

			case 'ADD_CLOCK_BEAT':
				this.addBeat();
			break

		}

	}

}

const clockStore = new ClockStore;

dispatcher.register(clockStore.handleActions.bind(clockStore));

export default clockStore;