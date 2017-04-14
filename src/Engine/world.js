import * as THREE from 'three'

class World {
  setScene (canvas) {
    if (!this.canvas) {
      this.canvas = canvas
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(75, null, 1, 10000)
      this.camera.position.z = 1000
      this.viewerEl = this.renderer.domElement.parentElement
      this.setSize()
    }
  }

  setSize () {
    this.renderer.setSize(0, 0)

    let previewCanvas, width, ratio

    const previewWidth = this.viewerEl.offsetWidth

    if (this.isSendingOutput) {
      previewCanvas = this.previewCanvas
      width = this.outputEl.offsetWidth
      ratio = width / this.outputEl.offsetHeight
      previewCanvas.width = this.outputEl.offsetWidth
      previewCanvas.height = previewCanvas.width / ratio
    } else {
      ratio = 16 / 9
      width = previewWidth
      previewCanvas = this.renderer.domElement
    }

    const height = width / ratio

    this.renderer.setSize(width, height)

    this.camera.aspect = ratio
    this.camera.updateProjectionMatrix()

    previewCanvas.style.width = previewWidth + 'px'
    previewCanvas.style.height = previewWidth / ratio + 'px'
  }

  setOutput (container) {
    this.width = container.offsetWidth
    this.height = container.offsetHeight
    this.outputEl = container

    // Move renderer canvas to new window
    this.outputEl.appendChild(this.renderer.domElement)
    this.renderer.domElement.setAttribute('style', '')

    // Setup preview canvas to replace renderer canvas in controls window
    this.previewCanvas = document.createElement('canvas')

    this.previewContext = this.previewCanvas.getContext('2d')
    this.viewerEl.appendChild(this.previewCanvas)

    this.isSendingOutput = true

    this.setSize()
  }

  render () {
    this.renderer.render(this.scene, this.camera)

    if (this.isSendingOutput) {
      this.previewContext.drawImage(this.renderer.domElement, 0, 0, this.width, this.height)
    }
  }
}

export default new World()
