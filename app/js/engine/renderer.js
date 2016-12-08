import {WebGLRenderer} from 'three';

const renderer = new WebGLRenderer();
const elContainer = document.getElementById('preview');

let width = elContainer.offsetWidth;
let height = width*0.56;

renderer.setSize( width, height );
elContainer.appendChild( renderer.domElement );

export default renderer;