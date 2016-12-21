import {Mesh, Object3D, BoxGeometry, MeshNormalMaterial} from 'three';
import Sketch from '../app/js/engine/Sketch';

const itemCount = 50;

class Field extends Sketch {

	constructor() {
		super();

		let geometry, material, mesh;

		this.data.params = {
			speed: {
				name: 'Speed',
				value: 0.5
			}
		}

		this.items = [];

		this.mesh = new Object3D();

		for (let i = 0; i < itemCount; i++) {

			geometry = new BoxGeometry(10,10,10);
			material = new MeshNormalMaterial();
			mesh = new Mesh(geometry, material);

			mesh.position.x = (Math.random() * 2000) - 1000;
			mesh.position.y = (Math.random() * 2000) - 1000;
			mesh.position.z = (Math.random() * 2000) - 1000;

			this.mesh.add(mesh);

			this.items.push(mesh);

		}

	}
	
	update() {

		for (let i = 0; i < itemCount; i++) {

			this.items[i].position.z += this.data.params.speed.value * 100;

			if (this.items[i].position.z > 1000) {
				this.items[i].position.z = -1000;
			}

		}


	}

}

module.exports = Field;