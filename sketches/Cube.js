import {Mesh, Object3D, BoxGeometry, MeshNormalMaterial} from 'three';
import Sketch from '../app/js/engine/Sketch';

class Cube extends Sketch {

	constructor() {
		super();

		this.data.params = {
			rotSpeedX: {
				name: 'Rotation Speed X',
				value: 0,
			},
			rotSpeedY: {
				name: 'Rotation Speed Y',
				value: 0,
			},
			scale: {
				name: 'Scale',
				value: 0.5,
			}
		}

		const geometry = new BoxGeometry( 300, 300, 300);
		const material = new MeshNormalMaterial();
		const cube = new Mesh( geometry, material );

		this.mesh = new Object3D();
		this.mesh.add(cube);

	}
	
	update() {

		const scale = Math.max((this.data.params.scale.value) * 3, 0.000001);


		this.mesh.rotation.x += this.data.params.rotSpeedX.value/10;
		this.mesh.rotation.y += this.data.params.rotSpeedY.value/10;

		this.mesh.scale.set(scale, scale, scale);

	}

}

module.exports = Cube;