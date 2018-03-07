import * as THREE from 'three'
import uiEventEmitter from '../utils/uiEventEmitter'

class World {
  setScene (el) {
    if (!this.canvas) {
      this.viewerEl = el
      this.renderer = new THREE.WebGLRenderer()
      this.canvas = this.renderer.domElement
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(75, null, 1, 1000000)
      this.camera.position.z = 1000
      this.viewerEl.appendChild(this.canvas)
      this.setSize()

      uiEventEmitter.on('repaint', () => {
        this.setSize()
      })
    }
  }

  setSize () {
    let width, ratio

    if (this.isSendingOutput) {
      // Get width and ratio from output window
      width = this.outputEl.offsetWidth
      ratio = width / this.outputEl.offsetHeight

      // Set canvas width and height attr
      this.previewCanvas.width = width
      this.previewCanvas.height = width / ratio
    } else {
      // Basic width and ratio if no output
      width = this.viewerEl.offsetWidth
      ratio = 16 / 9
    }

    const perc = 100 / ratio
    const height = width / ratio

    this.renderer.setSize(width, height)

    this.camera.aspect = ratio
    this.camera.updateProjectionMatrix()

    // CSS trick to resize canvas
    this.viewerEl.style.paddingBottom = perc + '%'

    // Set new dimensions so output copying is correct
    this.width = width
    this.height = height
  }

  setOutput (win) {
    this.stopOutput()
    const container = win.document.querySelector('div')

    this.width = container.offsetWidth
    this.height = container.offsetHeight
    this.outputEl = container

    // Move renderer canvas to new window
    this.outputEl.appendChild(this.canvas)
    this.canvas.setAttribute('style', '')

    // Setup preview canvas to replace renderer canvas in controls window
    this.previewCanvas = document.createElement('canvas')
    this.previewCanvas.style = 'position: absolute; left: 0; height: 0; width:100%; height:100%;'

    this.previewContext = this.previewCanvas.getContext('2d')
    this.viewerEl.appendChild(this.previewCanvas)

    this.isSendingOutput = true

    this.setSize()

    win.addEventListener('resize', () => {
      uiEventEmitter.emit('repaint')
    })
  }

  stopOutput () {
    this.viewerEl.innerHTML = ''
    this.canvas.setAttribute('style', '')
    this.viewerEl.appendChild(this.canvas)

    this.isSendingOutput = false

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
