import * as THREE from 'three'
const geomSize = 1

const repositionVec = new THREE.Vector3(0.5, 0.5, 0.5)

// Defining 5 geometries (the platonic solids!)
const geoms = {
  cube: new THREE.BoxGeometry(geomSize, geomSize, geomSize),
  tetra: new THREE.TetrahedronGeometry(geomSize),
  octa: new THREE.OctahedronGeometry(geomSize),
  icosa: new THREE.IcosahedronGeometry(geomSize),
  dodeca: new THREE.DodecahedronGeometry(geomSize),
}

type GeomName = keyof typeof geoms

export default class Solid {
  root = new THREE.Group()
  meshes: Record<GeomName, THREE.Mesh> = {} as Record<GeomName, THREE.Mesh>
  geomNames = Object.keys(geoms) as GeomName[]
  mat = new THREE.MeshBasicMaterial({ wireframe: true })
  currGeomName = 'cube'

  constructor() {
    for (const geomName of this.geomNames) {
      const mesh = new THREE.Mesh(geoms[geomName], this.mat)
      this.meshes[geomName] = mesh
      this.root.add(mesh)
      mesh.visible = false
    }
  }

  update({ params, deltaFrame }) {
    const baseSpeed = 0.15

    // Update rotation using params
    // Multipying by deltaFrame to keep the speed consistent, even if frames are skipped
    this.root.rotation.x += params.rotSpeedX * baseSpeed * deltaFrame
    this.root.rotation.y += params.rotSpeedY * baseSpeed * deltaFrame
    this.root.rotation.z += params.rotSpeedZ * baseSpeed * deltaFrame

    // TODO: Won't need to do this once we have min/max values in the UI
    this.root.position
      .set(...params.position)
      .sub(repositionVec)
      .multiplyScalar(10)

    this.mat.color.setRGB(...params.color)

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
