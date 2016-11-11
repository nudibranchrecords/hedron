var scene = require( './scenes' );
var inputs = require( './inputs' );
var data = require('../data/demopatch.json')

var sketches = [];

module.exports = new Sketches;

function Sketches() {

	for ( var i = 0; i < data.length; i++ ) {

		// Require and instantiate sketch
		var Sketch = require( '../sketches/' + data[ i ].id );
		var sketch = new Sketch();

		// Override sketch defaults with params from data
		sketch.params = Object.assign({}, sketch.defaults, data[i].params);
		sketch.inputs = data[i].inputs;
		sketch.nodes = data[i].nodes;

		sketches.push( sketch );

		inputs.registerSketch(sketch);

	}

	for ( var i = 0; i < sketches.length; i++ ) {

		scene.add( sketches[ i ].mesh );

	}

}

Sketches.prototype.update = function() {

	for ( var i = 0; i < sketches.length; i++ ) {
		
		sketches[ i ].update();

	}

}
