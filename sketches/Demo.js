const THREE = require('three');

module.exports = Cube;

function Cube () {

	this.defaults = {
		rotSpeedX: 0.01,
		rotSpeedY: 0.01,
		scale: 1
	}

	var geometry = new THREE.BoxGeometry( 300, 300, 300);
	var material = new THREE.MeshNormalMaterial();

	var cube = new THREE.Mesh( geometry, material );

	this.mesh = new THREE.Object3D();
	this.mesh.add(cube);

}

Cube.prototype.update = function() {

	this.mesh.rotation.x += this.params.rotSpeedX;
	this.mesh.rotation.y += this.params.rotSpeedY;
	this.mesh.scale.set(this.params.scale, this.params.scale, this.params.scale);

}