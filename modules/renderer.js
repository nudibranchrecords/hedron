import {WebGLRenderer} from 'three';

const renderer = new WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

export default renderer;