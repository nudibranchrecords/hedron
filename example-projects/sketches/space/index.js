const { THREE } = window.HEDRON.dependencies
const cubeTextureLoader = new THREE.CubeTextureLoader()

class Space {
  constructor ({ camera, scene, sketchesDir }) {
    this.root = new THREE.Group()

    camera.position.z = 40

    scene.background = cubeTextureLoader
      .setPath(`${sketchesDir}/space/assets/`)
      .load([
        'px.jpg', 'nx.jpg',
        'py.jpg', 'ny.jpg',
        'pz.jpg', 'nz.jpg',
      ])

    // Hacky way to get orbit controls working with the viewer
    const viewerEl = document.getElementById('viewer')
    this.controls = new THREE.OrbitControls(camera, viewerEl)

    // Lights
    const ambientLight = new THREE.AmbientLight(0x11bd92)
    const directionalLight = new THREE.DirectionalLight(0xfff79e)

    directionalLight.position.set(1.4, 0.2, 2)

    this.root.add(directionalLight)
    this.root.add(ambientLight)

    const mats = [
      new THREE.MeshStandardMaterial({
        roughness: 0.5,
        metalness: 1,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x4bc4c4,
        roughness: 0.7,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xf5b642,
        roughness: 0.7,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x9f17d1,
        roughness: 0.7,
      }),
      new THREE.MeshBasicMaterial({
        wireframe: true,
      }),

    ]

    const geoms = [
      new THREE.DodecahedronBufferGeometry(1),
      new THREE.TetrahedronBufferGeometry(1),
      new THREE.OctahedronBufferGeometry(1),
      new THREE.TorusBufferGeometry(1, 0.3, 16, 64),
    ]

    const rndPos = () => Math.random() * 40 - 20
    const rndRot = () => Math.random() * Math.PI * 2

    // Meshes
    for (let i = 0; i < 50; i++) {
      const geomIndex = Math.floor(Math.random() * geoms.length)
      const matLength = geomIndex === 3 ? mats.length - 1 : mats.length // no wireframe for torus
      const matIndex = Math.floor(Math.random() * matLength)
      const geom = geoms[geomIndex]
      const mat = mats[matIndex]
      const mesh = new THREE.Mesh(geom, mat)

      mesh.position.set(rndPos(), rndPos(), rndPos())
      mesh.rotation.set(rndRot(), rndRot(), rndRot())

      const sc = Math.random() * 3 + 1
      mesh.scale.set(sc, sc, sc)

      this.root.add(mesh)
    }
  }

  update ({ deltaFrame: d }) {
    this.root.rotation.x += 0.001 * d
    this.root.rotation.y += 0.002 * d
  }

  // Orbit controls need to be desposed of if sketch is deleted or reloaded
  destructor () {
    this.controls.dispose()
  }
}

module.exports = Space
