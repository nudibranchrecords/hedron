const THREE = require('three');

module.exports = Cube;

function Cube () {

	this.geometry = new THREE.BoxGeometry( 100, 100, 100);
	this.material = new THREE.MeshNormalMaterial();

	this.cube = new THREE.Mesh( this.geometry, this.material );

	this.mesh = new THREE.Object3D();
	this.mesh.add(this.cube);

}

Cube.prototype.update = function() {

	this.mesh.rotation.x += 0.01;
	this.mesh.rotation.y += 0.02;

}