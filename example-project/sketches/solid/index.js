import { int } from 'three/webgpu'

const { THREE } = window.HEDRON.dependencies
const geomSize = 1

export default class Solid {
  constructor() {
    // All sketches need root property to add things to
    this.root = new THREE.Group()

    this.meshes = {}

    this.mat = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff })

    // Defining 5 geometries (the platonic solids!)
    const geoms = {
      cube: new THREE.BoxGeometry(geomSize, geomSize, geomSize),
      tetra: new THREE.TetrahedronGeometry(geomSize),
      octa: new THREE.OctahedronGeometry(geomSize),
      icosa: new THREE.IcosahedronGeometry(geomSize),
      dodeca: new THREE.DodecahedronGeometry(geomSize),
    }

    this.geomNames = Object.keys(geoms)

    // TODO: this is just while we don't have params to feed in
    this.root.rotation.x += Math.random()
    this.root.rotation.y += Math.random()
    this.root.rotation.z += Math.random()
    this.root.scale.set(2, 2, 2)

    const keys = Object.keys(geoms)
    const initGeom = keys[Math.floor(Math.random() * keys.length)]

    // Create all 5 meshes and add to the sketch
    for (const geomName in geoms) {
      const mesh = new THREE.Mesh(geoms[geomName], this.mat)
      this.meshes[geomName] = mesh
      this.root.add(mesh)
      mesh.visible = geomName === initGeom
    }
  }

  update({ params, deltaFrame }) {
    const baseSpeed = 0.15

    // Update rotation using params
    // Multipying by deltaFrame to keep the speed consistent, even if frames are skipped
    this.root.rotation.x += params.rotSpeedX * baseSpeed * deltaFrame
    this.root.rotation.y += params.rotSpeedY * baseSpeed * deltaFrame
    this.root.rotation.z += params.rotSpeedZ * baseSpeed * deltaFrame

    // Update scale using params
    this.root.scale.set(params.scale, params.scale, params.scale)

    // Use boolean param for wireframe mode
    this.mat.wireframe = params.isWireframe

    // If the geom name has changed, swap out the mesh
    if (this.currGeomName !== params.geomName) {
      if (this.currGeomName) this.meshes[this.currGeomName].visible = false
      this.meshes[params.geomName].visible = true
      this.currGeomName = params.geomName
    }
  }

  // This is a shot to randomly change the geometry
  randomGeom() {
    const i = Math.floor(Math.random() * this.geomNames.length)

    // Return the param that has changed so it updates in Hedron
    return {
      geomName: this.geomNames[i],
    }
  }
}
