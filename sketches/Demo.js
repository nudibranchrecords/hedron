const THREE = require('three');

module.exports = Cube;

function Cube () {

	this.defaults = {
		rotSpeedX: 0.5,
		rotSpeedY: 0.5,
		scale: 0
	}

	var geometry = new THREE.BoxGeometry( 300, 300, 300);
	var material = new THREE.MeshNormalMaterial();

	var cube = new THREE.Mesh( geometry, material );

	this.mesh = new THREE.Object3D();
	this.mesh.add(cube);

}

Cube.prototype.update = function() {

	var scale = this.params.scale + 1;

	this.mesh.rotation.x += this.params.rotSpeedX/10;
	this.mesh.rotation.y += this.params.rotSpeedY/10;

	this.mesh.scale.set(scale, scale, scale);
	
	

}