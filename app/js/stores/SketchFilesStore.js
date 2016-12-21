import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

class SketchFilesStore extends EventEmitter {

	constructor() {

		super();

		this.files = ['Cube', 'Field'];

	}

	getAll() {
		return this.files;
	}

	handleActions(action) {

		switch(action.type) {

		}

	}

}

const sketchFilesStore = new SketchFilesStore;

dispatcher.register(sketchFilesStore.handleActions.bind(sketchFilesStore));

export default sketchFilesStore;