import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

class AudioBandsStore extends EventEmitter {

	constructor() {

		super();

		this.count = 4;

	}

	getCount() {
		return this.count;
	}

	handleActions(action) {

		switch(action.type) {

			
		}

	}

}

const audioBandsStore = new AudioBandsStore;

dispatcher.register(audioBandsStore.handleActions.bind(audioBandsStore));

export default audioBandsStore;