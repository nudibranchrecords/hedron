import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

class DisplaysStore extends EventEmitter {

	constructor() {

		super();

	}

	initDisplay() {

		this.emit('init');

	}

	handleActions(action) {

		switch(action.type) {

			case 'INIT_DISPLAY':
			this.initDisplay();
			break

		}

	}

}

const displaysStore = new DisplaysStore;

dispatcher.register(displaysStore.handleActions.bind(displaysStore));

export default displaysStore;