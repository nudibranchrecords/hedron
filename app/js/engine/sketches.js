import SketchesStore from '../stores/SketchesStore';

import scene from './scenes';

class Sketches {

	constructor() {

		SketchesStore.on('delete', this.removeSketch);
		SketchesStore.on('create', this.addSketch);

	}

	init() {

		this.sketches = SketchesStore.getAll();

		for (const key of Object.keys(this.sketches)) {

			// Add to scene
			scene.add(this.sketches[key].mesh);

		}

	}
	
	update() {

		for (const key of Object.keys(this.sketches)) {

			this.sketches[ key ].update();

		}

	}

	removeSketch(id) {
		scene.remove(this.sketches[id].mesh);
	}

	addSketch(id) {
		scene.add(this.sketches[id].mesh);
	}


}

export default new Sketches();