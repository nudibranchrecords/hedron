import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

class BeatsStore extends EventEmitter {

	constructor() {

		super();

		this.bpm = '110';
		this.currentBeat = 1
		this.delta = 0;
		this.mode = 'generated';

	}

	setCurrentBeat(beat) {
		this.currentBeat = beat;
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

	setDelta(delta) {
		this.delta = delta;
	}

	getDelta() {
		return this.delta;
	}


	handleActions(action) {

		switch(action.type) {

			case 'XXX':
			break

		}

	}

}

const beatsStore = new BeatsStore;

dispatcher.register(beatsStore.handleActions.bind(beatsStore));

export default beatsStore;