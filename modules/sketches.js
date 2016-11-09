var scene = require( './scenes' );


var data = [ 'Demo' ]

var sketches = [];


module.exports = new Sketches;

function Sketches() {

	for ( var i = 0; i < data.length; i++ ) {

		var Sketch = require( '../sketches/' + data[ i ] );
		sketches.push( new Sketch );

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
