import SketchesStore from '../stores/SketchesStore';
import AudioBandsStore from '../stores/AudioBandsStore';
import AudioInputs from './AudioInputs';

import * as SketchActions from '../actions/SketchActions';

class Inputs {

	constructor() {

		this.inputs = {}
		this.sketches = SketchesStore.getAll();
		this.keys = AudioBandsStore.getKeys();

		AudioInputs.on('updated', this.parseInputs.bind(this));

	}

	parseInputs() {

		this.inputs = {}

		var audioData = AudioInputs.getData();

		for (let i = 0; i < this.keys.length; i++) {
			this.inputs[this.keys[i]] = audioData[i];
		}
		
	    Object.keys(this.sketches).map((sketchId) => {

	    	if (this.sketches[sketchId].inputs) {

		    	if (this.sketches[sketchId].inputs.audio) {

					this.parseAudioInputs(sketchId, this.sketches[sketchId].inputs.audio);
					
				}

				// if (this.sketches[i].inputs.nodes) {
				// 	this.parseNodeInputs(this.sketches[i].nodes, this.sketches[i].inputs.nodes, this.sketches[i].params);
				// }

			}

	    });

	}

	onMidiInput(id, val) {

		for (let i = 0; i < this.sketches.length; i++) {


			if (this.sketches[i].inputs.midi) {

				const param = this.sketches[i].inputs.midi[id].param;
				const node = this.sketches[i].inputs.midi[id].node;

				if (param) {
					this.sketches[i].params[param] = val; 
				}

				if (node) {
					this.sketches[i].nodes[node].modifier.val = val; 
				}

			}

		}

	}

	parseNodeInputs(nodes, inputs, params) {

		const parseNode = (node) => {

			let input;
			const modifier = require('../../modifiers/'+node.modifier.name);

			if (node.input.type == 'audio') {

				input = this.inputs[node.input.id];

			} else if (node.input.type == 'node') {

				input = parseNode(nodes[node.input.id]);

			}
			
			return modifier(node.modifier.val, input);

		}

		for (let i = 0; i < inputs.length; i++) {


			params[inputs[i].param] = parseNode(nodes[inputs[i].id]);

		}

	}

	parseAudioInputs(sketchId, inputs) {

		for (const key of Object.keys(inputs)) {

			SketchActions.editSketchParam(sketchId, key, this.inputs[inputs[key]]);

		}

	}
	
}

export default new Inputs;