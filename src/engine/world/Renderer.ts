import { WebGLRenderer } from 'three'
import { EngineScene } from './EngineScene'
import { engineScenes } from './scenes'

export class Renderer {
  private renderer: WebGLRenderer | undefined
  private rendererHeight: number = 0
  private rendererWidth: number = 0
  private viewerContainer: HTMLDivElement | undefined
  private outputContainer: HTMLDivElement | undefined | null
  private previewCanvas: HTMLCanvasElement | undefined
  private outputCanvas: HTMLCanvasElement | undefined
  private canvas: HTMLCanvasElement | undefined
  private previewContext: CanvasRenderingContext2D | undefined | null

  private isSendingOutput = false

  public createCanvas(containerEl: HTMLDivElement): void {
    this.renderer = new WebGLRenderer({
      antialias: false, // Antialiasing should be handled by the composer
    })

    this.canvas = this.renderer.domElement
    containerEl.innerHTML = ''
    containerEl.appendChild(this.canvas)
    this.viewerContainer = containerEl

    this.setSize()
  }

  public setSize(): void {
    if (!this.renderer) throw new Error('Renderer not set')
    if (!this.viewerContainer) throw new Error('viewerEl not set')

    const settings = {
      aspectW: 16,
      aspectH: 9,
    }

    let width: number, ratio: number

    if (this.isSendingOutput) {
      if (!this.previewCanvas) throw new Error('previewCanvas not set')
      if (!this.outputCanvas) throw new Error('outputCanvas not set')
      if (!this.outputContainer) throw new Error('outputContainer not set')

      // Get width and ratio from output window
      width = this.outputContainer.offsetWidth
      ratio = width / this.outputContainer.offsetHeight
      this.previewCanvas.width = width
      this.previewCanvas.height = width / ratio
      this.outputCanvas.width = width
      this.outputCanvas.height = width / ratio
    } else {
      // Basic width and ratio if no output
      width = this.viewerContainer.offsetWidth
      ratio = settings.aspectW / settings.aspectH
    }

    const perc = 100 / ratio
    const height = width / ratio

    this.renderer.setSize(width, height)

    // Set ratios for each scene
    engineScenes.forEach((scene) => {
      scene.setRatio(ratio)
    })

    this.rendererWidth = width
    this.rendererHeight = height

    // CSS trick to resize canvas
    this.viewerContainer.style.paddingBottom = perc + '%'
  }

  public setOutput(win: Window): void {
    this.stopOutput()
    this.outputContainer = win.document.querySelector('div')

    if (!this.outputContainer) throw new Error("Can't find container")
    if (!this.canvas) throw new Error("Can't find canvas")
    if (!this.viewerContainer) throw new Error("Can't find viewerContainer")

    this.rendererHeight = this.outputContainer.offsetWidth
    this.rendererWidth = this.outputContainer.offsetHeight

    // Move renderer canvas to new window
    this.outputContainer.appendChild(this.canvas)
    this.canvas.setAttribute('style', '')

    // Setup output canvas
    this.outputCanvas = this.canvas

    // Setup preview canvas in dom
    this.previewCanvas = document.createElement('canvas')
    this.previewContext = this.previewCanvas.getContext('2d')
    this.viewerContainer.appendChild(this.previewCanvas)

    this.isSendingOutput = true

    this.setSize()

    win.addEventListener('resize', () => {
      this.setSize()
    })
  }

  private copyPixels(context: CanvasRenderingContext2D): void {
    if (!this.renderer) throw new Error("Can't find renderer")
    context.drawImage(this.renderer.domElement, 0, 0, this.rendererWidth, this.rendererHeight)
  }

  public stopOutput(): void {
    if (!this.isSendingOutput) return

    if (!this.outputContainer) throw new Error("Can't find container")
    if (!this.canvas) throw new Error("Can't find canvas")
    if (!this.viewerContainer) throw new Error("Can't find viewerContainer")

    this.viewerContainer.innerHTML = ''
    this.canvas.setAttribute('style', '')
    this.viewerContainer.appendChild(this.canvas)
    this.isSendingOutput = false

    this.setSize()
  }

  public render({ scene, camera }: EngineScene): void {
    if (!this.renderer) return

    this.renderer.render(scene, camera)

    if (this.isSendingOutput) {
      if (!this.previewContext) throw new Error('No preview context')
      this.copyPixels(this.previewContext)
    }
  }
}
