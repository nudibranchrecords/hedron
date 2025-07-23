import * as THREE from 'three'

export default class Shoutout {
  root = new THREE.Group()
  plane: THREE.Mesh
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  texture: THREE.CanvasTexture

  constructor() {
    // Create canvas for text texture
    this.canvas = document.createElement('canvas')
    this.canvas.width = 1024
    this.canvas.height = 512
    this.context = this.canvas.getContext('2d')!

    // Set up canvas styling
    this.context.fillStyle = '#000000'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.fillStyle = '#ffffff'
    this.context.font = '48px Arial'
    this.context.textAlign = 'center'
    this.context.textBaseline = 'middle'

    // Create texture from canvas
    this.texture = new THREE.CanvasTexture(this.canvas)

    // Create plane geometry and material
    const geometry = new THREE.PlaneGeometry(4, 2)
    const material = new THREE.MeshBasicMaterial({ map: this.texture })
    this.plane = new THREE.Mesh(geometry, material)
    this.root.add(this.plane)
  }

  update({ params: p }: { params: { message: string; position: [number, number, number] } }) {
    this.plane.position.set(...p.position)

    // Clear canvas
    this.context.fillStyle = '#000000'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw text
    this.context.fillStyle = '#ffffff'
    this.context.fillText(p.message, this.canvas.width / 2, this.canvas.height / 2)

    // Update texture
    this.texture.needsUpdate = true
  }
}
