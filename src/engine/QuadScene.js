import * as THREE from 'three'
const vert = `
  varying vec2 vUv;

  void main() {

  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

  }
`
const frag = `
  varying vec2 vUv;
  uniform sampler2D tDiffuseA;
  uniform sampler2D tDiffuseB;
  uniform float mixRatio;

  void main() {

    vec4 a = texture2D( tDiffuseA, vUv );
    vec4 b = texture2D( tDiffuseB, vUv );
    gl_FragColor = mix( a, b, mixRatio );

  }
`

class QuadScene {
  constructor (rttA, rttB) {
    this.material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        tDiffuseA: { value: rttA.texture },
        tDiffuseB: { value: rttB.texture },
        mixRatio: { value: 0 },
      },
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
