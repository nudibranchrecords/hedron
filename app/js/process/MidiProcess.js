import SketchesStore from '../stores/SketchesStore';

import MidiInputs from '../inputs/MidiInputs';

import Modify from './Modify';

import * as SketchActions from '../actions/SketchActions';

class MidiProcess {

	constructor() {

		this.sketches = SketchesStore.getAll();

		MidiInputs.on('message', this.onMidiInput.bind(this));

	}

	
	onMidiInput(id, val) {

		for (const sketchId of Object.keys(this.sketches)) {

			const sketchInputs = this.sketches[sketchId].data.inputs;

			if (sketchInputs.midi && sketchInputs.midi[id]) {

				const param = sketchInputs.midi[id].param;
				const modifier = sketchInputs.midi[id].modifier;

				if (param) {

					if (modifier) {
						SketchActions.editSketchParamModifier(sketchId, param, modifier, val);
					} else {
						SketchActions.editSketchParam(sketchId, param, val);
					}
					
				}

			}

		}

	}

}

export default new MidiProcess();