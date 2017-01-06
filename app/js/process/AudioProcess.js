import SketchesStore from '../stores/SketchesStore';
import AudioBandsStore from '../stores/AudioBandsStore';

import AudioInputs from '../inputs/AudioInputs';

import Modify from './Modify';

import * as SketchActions from '../actions/SketchActions';

class AudioProcess {

	constructor() {

		this.sketches = SketchesStore.getAll();

		this.audioBandKeys = AudioBandsStore.getKeys();
		this.audioBands = {}

	}

	update() {

		const audioData = AudioInputs.getData();

		if (audioData) {
				
			for (let i = 0; i < this.audioBandKeys.length; i++) {
				this.audioBands[this.audioBandKeys[i]] = audioData[i];
			}
		}
		

		Object.keys(this.sketches).map((sketchId) => {

	    	const sketchInputs = this.sketches[sketchId].data.inputs;

	    	if (sketchInputs && sketchInputs.audio) {

				for (const param of Object.keys(sketchInputs.audio)) {

					let val = this.audioBands[sketchInputs.audio[param]];

					const modifierArray = this.sketches[sketchId].data.params[param].modifiers;

					if (modifierArray) {
						val = Modify.modifyInput(val, modifierArray);
					}

					SketchActions.editSketchParam(sketchId, param, val);

				}
		    
	    	}

	    });
	}

}

export default new AudioProcess();