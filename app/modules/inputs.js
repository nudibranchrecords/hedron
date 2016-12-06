import audioInputs from './audioInputs';

class Inputs {

	constructor() {

		this.inputs = {}
		this.sketches = [];

	}

	update() {

		var audioData = audioInputs.update();


		if (audioData) {

			this.inputs = {
				"audio0": audioData[0],
				"audio1": audioData[1],
				"audio2": audioData[2],
				"audio3": audioData[3]
			}
		}

		for (let i = 0; i < this.sketches.length; i++) {

			if (this.sketches[i].inputs.audio) {
				this.parseAudioInputs(this.sketches[i].inputs.audio, this.sketches[i].params);
			}

			if (this.sketches[i].inputs.nodes) {
				this.parseNodeInputs(this.sketches[i].nodes, this.sketches[i].inputs.nodes, this.sketches[i].params);
			}

		}

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

	parseAudioInputs(inputs, params) {

		for (let i = 0; i < inputs.length; i++) {

			// Assign input value to designated param
			params[inputs[i].param] = this.inputs[inputs[i].id];

		}

	}

	registerSketch(sketch) {
		this.sketches.push(sketch);
	}
	
}

export default new Inputs;