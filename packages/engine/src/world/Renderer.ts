import debounce from 'lodash.debounce'
import { EffectComposer } from 'postprocessing'
import { WebGLRenderer } from 'three'
import { RenderPipeline, WebGPURenderer } from 'three/webgpu'
import { CanvasSizeMode, RendererType } from '@HedronEngine/types'
import { EngineScene } from '@world/EngineScene'
import { engineScenes } from '@world/scenes'

export class Renderer {
  public composer: EffectComposer | undefined
  public renderer: WebGPURenderer | WebGLRenderer
  public renderPipeline: RenderPipeline | undefined
  public rendererType: RendererType
  private rendererHeight: number = 0
  private rendererWidth: number = 0
  private viewerContainer: HTMLElement | undefined
  private outputContainer: HTMLElement | undefined | null
  private previewCanvas: HTMLCanvasElement | undefined
  private outputCanvas: HTMLCanvasElement | undefined
  private outputWindow: Window = window
  private canvas: HTMLCanvasElement | undefined
  private previewContext: CanvasRenderingContext2D | undefined | null
  public aspectRatio: number = 1
  public passesNeedUpdate_webGPU: boolean = true
  private isSendingOutput = false
  private canvasSizeMode: CanvasSizeMode
  private frameCallback: (() => void) | null = null
  private rafId: number | null = null

  constructor({
    rendererType,
    canvasSizeMode,
  }: {
    rendererType: RendererType
    canvasSizeMode: CanvasSizeMode
  }) {
    this.rendererType = rendererType
    this.canvasSizeMode = canvasSizeMode

    switch (this.rendererType) {
      case 'webgl':
        this.renderer = new WebGLRenderer({
          antialias: false, // Antialiasing should be handled by the composer
          preserveDrawingBuffer: true, // Required for frame capture to work consistently
        })
        this.composer = new EffectComposer(this.renderer)
        break
      case 'webgpu':
        console.warn(
          '[HEDRON] 👽 You are running Hedron in WebGPU mode (set in .env). This is experimental and your sketches may not work if you havent designed them to be compatible.',
        )
        this.renderer = new WebGPURenderer()
        this.renderPipeline = new RenderPipeline(this.renderer)
        break
      default:
        throw new Error(`Unsupported renderer type: ${this.rendererType}`)
    }
  }

  private setResizeObserver = (el: HTMLElement) => {
    const resizeObserver = new ResizeObserver(
      debounce(() => {
        this.setSize()
      }, 300),
    )

    resizeObserver.observe(el)
  }

  /**
   * Creates a canvas element for the renderer and attaches it to the specified container.
   * @param containerEl The HTML element to contain the renderer's canvas.
   */
  public createCanvas(containerEl: HTMLElement): void {
    this.canvas = this.renderer.domElement
    containerEl.innerHTML = ''
    containerEl.appendChild(this.canvas)
    this.viewerContainer = containerEl
    this.setResizeObserver(containerEl)
  }

  // Capture the current frame as a data URL
  public captureFrame(): string | null {
    if (!this.canvas) {
      console.error('Canvas not available for capture')
      return null
    }

    // TODO: This type guarding is shaky because there is no real connection between `composer` and rendererType.
    // Ideally, we should have a more robust way to type composer/postprocessing or just unify them
    if (this.rendererType === 'webgl' && !this.composer) {
      console.error('Composer not initialized for rendering')
      return null
    }

    const dataUrl = this.canvas.toDataURL('image/png')
    return dataUrl
  }

  public setSize(): void {
    const composerOrRenderer = this.composer || this.renderer
    if (!composerOrRenderer) throw new Error('No renderer or composer to set size for')
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

      // During a performance sending output to an external display (e.g. projector)
      // we can assume the desired pixel ratio is 1
      this.renderer.setPixelRatio(1)

      // Get width and ratio from output window
      width = this.outputContainer.offsetWidth
      ratio = width / this.outputContainer.offsetHeight
      this.previewCanvas.width = width
      this.previewCanvas.height = width / ratio
      this.outputCanvas.width = width
      this.outputCanvas.height = width / ratio
    } else {
      // When working on a laptop (or web project!), we match the device's pixel ratio
      this.renderer.setPixelRatio(window.devicePixelRatio)

      switch (this.canvasSizeMode) {
        case 'fixedAspectRatio':
          width = this.viewerContainer.offsetWidth
          ratio = settings.aspectW / settings.aspectH
          break
        case 'fillContainer':
          width = this.viewerContainer.offsetWidth
          ratio = this.viewerContainer.offsetWidth / this.viewerContainer.offsetHeight
          break
        default:
          throw new Error(`Unknown canvas size mode: ${this.canvasSizeMode}`)
      }
    }

    const height = width / ratio

    composerOrRenderer.setSize(width, height)

    // Set ratios for each scene
    engineScenes.forEach((scene) => {
      scene.setRatio(ratio)
    })

    this.rendererWidth = width
    this.rendererHeight = height

    // CSS trick to resize canvas
    if (this.canvasSizeMode !== 'fillContainer') {
      const perc = 100 / ratio
      this.viewerContainer.style.paddingBottom = perc + '%'
    }

    this.aspectRatio = ratio
  }

  /**
   * Requests the next animation frame, making sure to match the refresh rate of the output window
   * @param callback The function to call on the next animation frame.
   */
  public requestFrame(callback: () => void): void {
    this.rafId = this.outputWindow.requestAnimationFrame(callback)
    this.frameCallback = callback
  }

  // Set the output to a second canvas (e.g. a separate window for making full screen)
  public setOutput(container: HTMLElement, outputWindow: Window): void {
    this.stopOutput()
    this.outputContainer = container
    this.outputWindow = outputWindow

    if (!this.outputContainer) throw new Error("Can't find container")
    if (!this.canvas) throw new Error("Can't find canvas")
    if (!this.viewerContainer) throw new Error("Can't find viewerContainer")

    this.rendererHeight = this.outputContainer.offsetWidth
    this.rendererWidth = this.outputContainer.offsetHeight

    // Move renderer canvas to new output container
    this.outputContainer.appendChild(this.canvas)
    this.canvas.setAttribute('style', '')

    // Setup output canvas
    this.outputCanvas = this.canvas

    // Setup preview canvas in dom
    this.previewCanvas = document.createElement('canvas')
    this.previewContext = this.previewCanvas.getContext('2d')
    this.viewerContainer.appendChild(this.previewCanvas)

    this.isSendingOutput = true

    this.setResizeObserver(this.outputContainer)
  }

  private copyPixels(context: CanvasRenderingContext2D): void {
    if (!this.canvas) throw new Error("Can't find canvas")
    context.drawImage(this.canvas, 0, 0, this.rendererWidth, this.rendererHeight)
  }

  public stopOutput(): void {
    if (!this.isSendingOutput) return

    if (!this.outputContainer) throw new Error("Can't find container")
    if (!this.canvas) throw new Error("Can't find canvas")
    if (!this.viewerContainer) throw new Error("Can't find viewerContainer")

    const previousWindow = this.outputWindow
    this.outputWindow = window
    this.viewerContainer.innerHTML = ''
    this.canvas.setAttribute('style', '')
    this.viewerContainer.appendChild(this.canvas)
    this.isSendingOutput = false

    // Keep frame loop going when switching back to the main window
    if (this.frameCallback) {
      if (this.rafId !== null) {
        previousWindow.cancelAnimationFrame(this.rafId)
      }
      this.rafId = this.outputWindow.requestAnimationFrame(this.frameCallback)
    }

    this.setSize()
  }

  /**
   * Resize the renderer's canvas to the given width and height.
   */
  public resize(width: number, height: number): void {
    if (!this.composer) throw new Error('Renderer not set')
    this.composer.setSize(width, height)
    this.rendererWidth = width
    this.rendererHeight = height
    if (this.viewerContainer) {
      this.viewerContainer.style.paddingBottom = (100 * height) / width + '%'
    }
  }

  /**
   * Get the current width of the renderer's canvas.
   */
  public getWidth(): number {
    return this.rendererWidth
  }

  /**
   * Get the current height of the renderer's canvas.
   */
  public getHeight(): number {
    return this.rendererHeight
  }

  public render(scene: EngineScene): void {
    if (!this.renderer) return

    if (this.renderer instanceof WebGPURenderer) {
      if (this.passesNeedUpdate_webGPU) {
        scene.updateWebGPUPasses(scene.sketches, this.renderPipeline!)
        this.passesNeedUpdate_webGPU = false
      }

      this.renderPipeline!.render()
    } else if (this.renderer instanceof WebGLRenderer) {
      if (this.composer && scene.passes) {
        this.composer.removeAllPasses()
        this.composer.passes = scene.passes
        for (let i = 0; i < scene.passes.length - 1; i++) {
          scene.passes[i].renderToScreen = false
        }
        scene.passes[scene.passes.length - 1].renderToScreen = true
        this.composer.render()
      }

      this.renderer.render(scene.scene, scene.camera)
    } else {
      throw new Error(`Unsupported renderer type: ${this.rendererType}`)
    }

    if (this.isSendingOutput) {
      if (!this.previewContext) throw new Error('No preview context')
      this.copyPixels(this.previewContext)
    }
  }
}
