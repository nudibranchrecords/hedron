import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

class AudioBandsStore extends EventEmitter {

	constructor() {

		super();

		this.count = 4;

		this.keys = [];

		for (let i = 0; i < this.count; i++) {

			this.keys.push('band_'+i);

		}

	}

	getCount() {
		return this.count;
	}

	getKeys() {
		return this.keys;
	}

	handleActions(action) {

		switch(action.type) {

			
		}

	}

}

const audioBandsStore = new AudioBandsStore;

dispatcher.register(audioBandsStore.handleActions.bind(audioBandsStore));

export default audioBandsStore;