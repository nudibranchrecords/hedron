import {Mesh, Object3D, BoxGeometry, MeshNormalMaterial} from 'three';

const itemCount = 50;

class Field {

	constructor() {

		let geometry, material, mesh;

		this.params = {
			speed: 0.5,
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

			this.items[i].position.z += this.params.speed * 100;

			if (this.items[i].position.z > 1000) {
				this.items[i].position.z = -1000;
			}

		}


	}

}

module.exports = Field;