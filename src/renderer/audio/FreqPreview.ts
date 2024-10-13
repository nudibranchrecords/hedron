/**
 * A class that recieves an AudioAnalyzer object and a html node to render the audio data to
 */

import * as THREE from 'three'
import { AudioData } from '@renderer/audio/AudioAnalyser'

export class FreqPreview {
  public canvas: HTMLCanvasElement
  public renderer: THREE.WebGLRenderer
  public scene: THREE.Scene
  public camera: THREE.PerspectiveCamera

  constructor(audioData: AudioData, node: HTMLDivElement) {
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(node.clientWidth, node.clientHeight)

    this.canvas = this.renderer.domElement
    node.appendChild(this.canvas)

    const geometry = new THREE.PlaneGeometry(1, 1)
    const material = new THREE.MeshBasicMaterial({ map: audioData.texture, side: THREE.DoubleSide })
    const mesh = new THREE.Mesh(geometry, material)

    this.scene = new THREE.Scene()
    this.scene.add(mesh)

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100000)
    this.camera.position.z = 1

    window.requestAnimationFrame(() => this.update())
  }

  public update() {
    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(() => this.update())
  }
}
