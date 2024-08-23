import { WebGLRenderer } from 'three'
import { EngineScene } from './EngineScene'
import { engineScenes } from '.'

// TODO: typing with undefined should be enforced with new TS setting soon
// https://github.com/microsoft/TypeScript/pull/55887
let renderer: WebGLRenderer | undefined
let viewerEl: HTMLDivElement | undefined

const isSendingOutput = false

export const createCanvas = (containerEl: HTMLDivElement): void => {
  renderer = new WebGLRenderer({
    antialias: false, // antialiasing should be handled by the composer
  })

  const domEl = renderer.domElement

  containerEl.innerHTML = ''
  containerEl.appendChild(domEl)
  viewerEl = containerEl

  setSize()
}

export const setSize = (): void => {
  if (!renderer) throw new Error('Renderer not set')
  if (!viewerEl) throw new Error('viewerEl not set')

  // TODO: settings in state
  const settings = {
    aspectW: 16,
    aspectH: 9,
  }

  let width: number, ratio: number

  if (isSendingOutput) {
    // Get width and ratio from output window
    // width = outputEl.offsetWidth
    // ratio = width / outputEl.offsetHeight
    // previewCanvas.width = width
    // previewCanvas.height = width / ratio
    // outputCanvas.width = width
    // outputCanvas.height = width / ratio
    ratio = 1
    width = 1
  } else {
    // Basic width and ratio if no output
    width = viewerEl.offsetWidth
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

  // rendererWidth = width
  // rendererHeight = height

  // CSS trick to resize canvas
  viewerEl.style.paddingBottom = perc + '%'
}

export const setOutput = (win: Window): void => {}

export const stopOutput = () => {}

export const render = ({ scene, camera }: EngineScene): void => {
  if (!renderer) return

  renderer.render(scene, camera)
}
