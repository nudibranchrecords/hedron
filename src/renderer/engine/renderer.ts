import { WebGLRenderer } from 'three'
import { EngineScene } from './EngineScene'
import { engineScenes } from '.'

// TODO: typing with undefined should be enforced with new TS setting soon
// https://github.com/microsoft/TypeScript/pull/55887
let renderer: WebGLRenderer | undefined
let rendererHeight: number
let rendererWidth: number
let viewerContainer: HTMLDivElement | undefined
let outputContainer: HTMLDivElement | undefined | null
let previewCanvas: HTMLCanvasElement | undefined
let outputCanvas: HTMLCanvasElement | undefined
let canvas: HTMLCanvasElement | undefined

let isSendingOutput = false

export const createCanvas = (containerEl: HTMLDivElement): void => {
  renderer = new WebGLRenderer({
    antialias: false, // antialiasing should be handled by the composer
  })

  canvas = renderer.domElement

  containerEl.innerHTML = ''
  containerEl.appendChild(canvas)
  viewerContainer = containerEl

  setSize()
}

export const setSize = (): void => {
  if (!renderer) throw new Error('Renderer not set')
  if (!viewerContainer) throw new Error('viewerEl not set')

  // TODO: settings in state
  const settings = {
    aspectW: 16,
    aspectH: 9,
  }

  let width: number, ratio: number

  if (isSendingOutput) {
    if (!previewCanvas) throw new Error('previewCanvas not set')
    if (!outputCanvas) throw new Error('outputCanvas not set')
    if (!outputContainer) throw new Error('outputContainer not set')

    // Get width and ratio from output window
    width = outputContainer.offsetWidth
    ratio = width / outputContainer.offsetHeight
    previewCanvas.width = width
    previewCanvas.height = width / ratio
    outputCanvas.width = width
    outputCanvas.height = width / ratio
  } else {
    // Basic width and ratio if no output
    width = viewerContainer.offsetWidth
    ratio = settings.aspectW / settings.aspectH
  }

  const perc = 100 / ratio
  const height = width / ratio

  renderer.setSize(width, height)
  // size.width = width
  // size.height = height

  // Set ratios for each scene
  engineScenes.forEach((scene) => {
    scene.setRatio(ratio)
  })

  rendererWidth = width
  rendererHeight = height

  // CSS trick to resize canvas
  viewerContainer.style.paddingBottom = perc + '%'
}

export const setOutput = (win: Window): void => {
  stopOutput()
  outputContainer = win.document.querySelector('div')

  if (!outputContainer) throw new Error("Can't find container")
  if (!canvas) throw new Error("Can't find canvas")
  if (!viewerContainer) throw new Error("Can't find vie")

  rendererHeight = outputContainer.offsetWidth
  rendererWidth = outputContainer.offsetHeight

  // Move renderer canvas to new window
  outputContainer.appendChild(canvas)
  canvas.setAttribute('style', '')

  // Setup output canvas
  // If preview and output are different, this canvas will be used and
  // renderer renders two different images, with images being copied from
  // the dom element to both preview and output canvases
  outputCanvas = document.createElement('canvas')
  // outputContext = outputCanvas.getContext('2d')
  outputContainer.appendChild(outputCanvas)

  // Setup preview canvas in dom
  // Pixels will be copied from renderer dom element to this
  previewCanvas = document.createElement('canvas')
  // previewContext = previewCanvas.getContext('2d')
  viewerContainer.appendChild(previewCanvas)

  isSendingOutput = true

  setSize()

  win.addEventListener('resize', () => {
    uiEventEmitter.emit('repaint')
  })
}

export const stopOutput = () => {}

export const render = ({ scene, camera }: EngineScene): void => {
  if (!renderer) return

  renderer.render(scene, camera)
}
