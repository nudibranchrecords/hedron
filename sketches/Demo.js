import {Mesh, Object3D, BoxGeometry, MeshNormalMaterial} from 'three';

class Cube {

	constructor() {

		this.defaults = {
			rotSpeedX: 0.5,
			rotSpeedY: 0.5,
			scale: 0
		}

		const geometry = new BoxGeometry( 300, 300, 300);
		const material = new MeshNormalMaterial();
		const cube = new Mesh( geometry, material );

		this.mesh = new Object3D();
		this.mesh.add(cube);

	}
	
	update() {

		const scale = this.params.scale + 1;

		this.mesh.rotation.x += this.params.rotSpeedX/10;
		this.mesh.rotation.y += this.params.rotSpeedY/10;

		this.mesh.scale.set(scale, scale, scale);

	}

}

module.exports = Cube;