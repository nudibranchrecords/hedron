var audioInput = require('./audioInputs');

module.exports = new Inputs;

function Inputs() {
	this.inputs = {}
}

Inputs.prototype.update = function() {

	var audio = audioInput.update();

	if (audio) {

		this.inputs = {
			"audio0": audio[0],
			"audio1": audio[1],
			"audio2": audio[2],
			"audio3": audio[3]
		}
	}


}


Inputs.prototype.parseInputs = function(inputs, params) {

	for (var i = 0; i < inputs.length; i++) {

		// Assign input value to designated param
		params[inputs[i].param] = this.inputs[inputs[i].id];

	}

}