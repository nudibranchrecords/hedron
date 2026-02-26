import * as THREE from 'three'

const shuffleString = (str: string): string => {
  const arr = str.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.join('')
}

interface ShoutoutParams {
  message: string
  color: [number, number, number]
  scrollSpeed: number
  position: [number, number]
}

interface MIDIEvent {
  device: MIDIInput
  channel: number
  type: number
  note: number
  value: number
}

export default class Shoutout {
  root = new THREE.Group()
  message: string = 'Hello, Hedron!'
  modifiedMessage: string | null = null
  plane: THREE.Mesh
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  texture: THREE.CanvasTexture
  textX: number = 0

  shuffle({ params: p }: { params: ShoutoutParams }) {
    this.modifiedMessage = shuffleString(p.message)
  }

  // TODO: This shot is a bit pointless until the same MIDI input can handle a range of notes
  displayMidiNote({ shotArgs }: { shotArgs?: { _midiEvent?: MIDIEvent } }) {
    const note = shotArgs?._midiEvent?.note
    if (!note) {
      console.warn('No MIDI event data provided for displayMidiNote shot.')
      return
    }

    this.modifiedMessage = note.toString()
  }

  clearShuffle() {
    this.modifiedMessage = null
  }

  resetScroll() {
    this.textX = 0
  }

  constructor({ renderer, camera }) {
    // Create canvas for text texture
    this.canvas = document.createElement('canvas')
    this.canvas.width = renderer.domElement.width
    this.canvas.height = renderer.domElement.height
    this.context = this.canvas.getContext('2d')!

    const aspect = this.canvas.width / this.canvas.height

    // Set up canvas styling
    this.context.font = '48px "Chivo Mono"'
    this.context.textAlign = 'left' // Change to left align for scrolling
    this.context.textBaseline = 'middle'

    // Create texture from canvas
    this.texture = new THREE.CanvasTexture(this.canvas)

    // Create plane geometry and material
    const geometry = new THREE.PlaneGeometry(1, 1 / aspect)
    const material = new THREE.MeshBasicMaterial({ map: this.texture })
    material.transparent = true
    this.plane = new THREE.Mesh(geometry, material)

    // Position the plane in front of the camera
    this.plane.position.copy(camera.position)
    this.plane.position.z -= 0.36

    this.root.add(this.plane)
  }

  update({ params: p }: { params: ShoutoutParams }) {
    if (this.message !== p.message) {
      this.clearShuffle()
      this.message = p.message
    }

    this.context.fillStyle = `rgb(${p.color.map((c) => c * 255).join(' ')})`

    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Move text to the left
    this.textX -= p.scrollSpeed

    // Get text width to know when to reset position
    const textWidth = this.context.measureText(p.message).width

    // Reset position when text has completely scrolled off screen
    if (this.textX < -this.canvas.width) {
      this.textX = this.canvas.width
    }

    const posX = p.position[0] * this.canvas.width - textWidth / 2 + this.textX
    const posY = p.position[1] * this.canvas.height

    this.context // Draw the scrolling text
      .fillText(this.modifiedMessage ?? p.message, posX, posY)

    // Update texture
    this.texture.needsUpdate = true
  }
}
