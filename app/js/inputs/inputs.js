import SketchesStore from '../stores/SketchesStore';
import AudioBandsStore from '../stores/AudioBandsStore';
import AudioInputs from './AudioInputs';
import MidiInputs from './MidiInputs';
import Clock from './Clock';
import GeneratedClock from './GeneratedClock';
import * as Modifiers from './modifiers';

import * as SketchActions from '../actions/SketchActions';

class Inputs {

	constructor() {

		this.inputs = {}
		this.sketches = SketchesStore.getAll();
		this.keys = AudioBandsStore.getKeys();

		this.clockDelta = 0;
		this.clockSpeed = Math.PI/96;

		MidiInputs.on('message', this.onMidiInput.bind(this));
		AudioInputs.on('updated', this.onMidiInput.bind(this));
		Clock.on('pulse', this.onClockPulse.bind(this));

	}

	update() {

		GeneratedClock.update();
		AudioInputs.update();

	}

	onAudioInput() {

		this.inputs = {}

		const audioData = AudioInputs.getData();

		for (let i = 0; i < this.keys.length; i++) {
			this.inputs[this.keys[i]] = audioData[i];
		}
		
	    Object.keys(this.sketches).map((sketchId) => {

	    	const sketchInputs = this.sketches[sketchId].data.inputs;

	    	if (sketchInputs && sketchInputs.audio) {

				this.parseAudioInputs(sketchId, sketchInputs.audio);

			}

	    });

	}

	onClockPulse() {

		this.clockDelta += this.clockSpeed;

		Object.keys(this.sketches).map((sketchId) => {

	    	const sketchInputs = this.sketches[sketchId].data.inputs;

	    	if (sketchInputs && sketchInputs.lfo) {

				this.parseLfoInputs(sketchId, sketchInputs.lfo);

			}

	    });

	}

	onMidiInput(id, val) {

		for (const sketchId of Object.keys(this.sketches)) {

			const sketchInputs = this.sketches[sketchId].data.inputs;

			if (sketchInputs.midi && sketchInputs.midi[id]) {

				const param = sketchInputs.midi[id].param;
				const modifier = sketchInputs.midi[id].modifier;
			//	const node = sketch.inputs.midi[id].node;

				if (param) {

					if (modifier) {
						SketchActions.editSketchParamModifier(sketchId, param, modifier, val);
					} else {
						SketchActions.editSketchParam(sketchId, param, val);
					}
					
				}

				// if (node) {
				// 	this.sketches[i].nodes[node].modifier.val = val; 
				// }

			}

		}

	}

	parseAudioInputs(sketchId, inputs) {

		for (const param of Object.keys(inputs)) {

			let val = this.inputs[inputs[param]];
			const modifierArray = this.sketches[sketchId].data.params[param].modifiers;

			if (modifierArray) {
				val = this.modifyInput(val, modifierArray);
			}

			SketchActions.editSketchParam(sketchId, param, val);

		}

	}

	parseLfoInputs(sketchId, inputs) {

		for (const param of Object.keys(inputs)) {

			const waveType = inputs[param].waveType;
			
			let y;

			switch (waveType) {
		        case 'sine':
		          y = Math.sin(this.clockDelta);
		          break;
		        case 'saw':
		          y = (this.clockDelta - Math.floor(this.clockDelta + 0.5)) * 2;
		          break;
		        case 'rSaw':
		          y = - (this.clockDelta - Math.floor(this.clockDelta + 0.5)) * 2;
		          break;
		        case 'square':
		          y = Math.sign(Math.sin(this.clockDelta));
		          break;
		        case 'triangle':
		          y = Math.abs((this.clockDelta - Math.floor(this.clockDelta + 0.5)) * 2);
		          break;
		    }

			y = (y+1)/2; // convert from -1 ~ 1 to 0 ~ 1

			SketchActions.editSketchParam(sketchId, param, y);

		}

	}



	modifyInput(value, modifierArray) {

		for (let i = 0; i < modifierArray.length; i++) {

			const m = parseFloat(modifierArray[i].m);
			const modifyFunction = Modifiers[modifierArray[i].id];

			if (modifyFunction) {
				value = modifyFunction(value, m);
			} else {
				console.error('Modifier not recognised: ', modifierArray[i].id)
			}
			
		}

		return value;

	}
	
}

export default new Inputs;