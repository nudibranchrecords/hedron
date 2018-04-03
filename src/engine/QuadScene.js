import * as THREE from 'three'
import glslify from 'glslify'
const vert = glslify.file('./src/shaders/simple-vert.glsl')
const frag = glslify.file('./src/shaders/texture-frag.glsl')

class QuadScene {
  constructor (rttA, rttB) {
    this.material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        tDiffuseA: { value: rttA.texture },
        tDiffuseB: { value: rttB.texture },
        mixRatio: { value: 0 }
      }
    })

    this.camera = new THREE.OrthographicCamera(null, null, null, null, -10000, 10000)
    this.scene = new THREE.Scene()
    const plane = new THREE.PlaneBufferGeometry(1, 1)
    this.quad = new THREE.Mesh(plane, this.material)
    this.scene.add(this.quad)
  }

  setSize (width, height) {
    // Set camera size
    this.camera.left = width / -2
    this.camera.right = width / 2
    this.camera.top = height / 2
    this.camera.bottom = height / -2
    this.camera.updateProjectionMatrix()
    // Set rtt quad size
    this.quad.scale.set(width, height, 1)
  }
}

export default QuadScene
