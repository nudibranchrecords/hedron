var audioInput = require('./audioInputs');

module.exports = new Inputs;

function Inputs() {
	this.inputs = {}
	this.sketches = [];
}

Inputs.prototype.update = function() {

	var audioData = audioInput.update();


	if (audioData) {

		this.inputs = {
			"audio0": audioData[0],
			"audio1": audioData[1],
			"audio2": audioData[2],
			"audio3": audioData[3]
		}
	}

	for (var i = 0; i < this.sketches.length; i++) {

		if (this.sketches[i].inputs.audio) {
			this.parseAudioInputs(this.sketches[i].inputs.audio, this.sketches[i].params);
		}

		if (this.sketches[i].inputs.nodes) {
			this.parseNodeInputs(this.sketches[i].nodes, this.sketches[i].inputs.nodes, this.sketches[i].params);
		}

	}

	
}

Inputs.prototype.onMidiInput = function(id, val) {

	for (var i = 0; i < this.sketches.length; i++) {


		if (this.sketches[i].inputs.midi) {

			var param = this.sketches[i].inputs.midi[id].param;
			var node = this.sketches[i].inputs.midi[id].node;

			if (param) {
				this.sketches[i].params[param] = val; 
			}

			if (node) {
				this.sketches[i].nodes[node].modifier.val = val; 
			}

		}

	}
}

Inputs.prototype.parseNodeInputs = function(nodes, inputs, params) {

	var _self = this;

	for (var i = 0; i < inputs.length; i++) {

		params[inputs[i].param] = parseNode(nodes[inputs[i].id]);

	}

	function parseNode(node) {

		var modifier = require('../modifiers/'+node.modifier.name);

		if (node.input.type == 'audio') {

			var input = _self.inputs[node.input.id];

		} else if (node.input.type == 'node') {

			var input = parseNode(nodes[node.input.id]);

		}
		
		return modifier(node.modifier.val, input);

	}

}


Inputs.prototype.parseAudioInputs = function(inputs, params) {

	for (var i = 0; i < inputs.length; i++) {

		// Assign input value to designated param
		params[inputs[i].param] = this.inputs[inputs[i].id];

	}

}

Inputs.prototype.registerSketch = function(sketch) {
	this.sketches.push(sketch);
}