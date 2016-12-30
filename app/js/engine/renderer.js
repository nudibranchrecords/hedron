import { EventEmitter } from 'events';

import {WebGLRenderer} from 'three';

class Renderer extends EventEmitter {

	constructor() {

		super();

		this.renderer = new WebGLRenderer();
		this.elContainer = document.getElementById('preview');
		this.elContainer.appendChild( this.renderer.domElement );
		this.resize();
		this.sendingOutput = false;

		this.initOutput = this.initOutput.bind(this);
		this.render = this.render.bind(this);

	}

	render( scene, camera ) {

		this.renderer.render( scene, camera );

		if (this.sendingOutput) {

			this.previewContext.drawImage(this.renderer.domElement, 0, 0, this.width, this.height);
		}

	}

	resize() {

		let previewCanvas;

		if (this.sendingOutput) {

			previewCanvas = this.previewCanvas;

		} else {

			this.width = 1024;
			this.height = 768;
			previewCanvas = this.renderer.domElement;

		}

		this.renderer.setSize( this.width, this.height );

		const ratio = this.height/this.width;
		const containerWidth = this.elContainer.offsetWidth;

		previewCanvas.style.width = containerWidth + 'px';
		previewCanvas.style.height = containerWidth * ratio + 'px';

		this.emit('resized');

	}

	initOutput(container) {

		this.width = container.offsetWidth;
		this.height = container.offsetHeight;

		// Move renderer canvas to new window		
		container.appendChild( this.renderer.domElement );
		this.renderer.domElement.setAttribute('style', '');

		// Setup preview canvas to replace renderer canvas in controls window
		this.previewCanvas = document.createElement('canvas');
		this.previewCanvas.width = this.width;
		this.previewCanvas.height = this.height;
		this.previewContext = this.previewCanvas.getContext('2d');
		this.elContainer.appendChild( this.previewCanvas );

		this.sendingOutput = true;

		this.resize();

	}


	
}


export default new Renderer();