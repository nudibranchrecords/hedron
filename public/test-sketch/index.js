const { THREE, TWEEN } = window.HEDRON.dependencies;

import "./test";

export class TestSketch {
  constructor({ sketchesDir }) {
    const dir = `${sketchesDir}/test-sketch`;
    this.root = new THREE.Group();

    const mat = new THREE.MeshNormalMaterial();
    // Add inner sphere
    const sphereGeom = new THREE.IcosahedronGeometry(1, 0);
    this.sphere = new THREE.Mesh(sphereGeom, mat);
    this.root.add(this.sphere);
  }
}
