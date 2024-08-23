import { WebGLRenderer } from 'three'
import { EngineScene } from './EngineScene'

// TODO: typing with undefined should be enforced with new TS setting soon
// https://github.com/microsoft/TypeScript/pull/55887
let renderer: WebGLRenderer | undefined

export const createCanvas = (containerEl: HTMLDivElement): void => {
  renderer = new WebGLRenderer({
    antialias: false, // antialiasing should be handled by the composer
  })

  const aspect = 9 / 16
  const w = containerEl.clientWidth
  const h = w * aspect

  renderer.setSize(w, h)

  const domEl = renderer.domElement

  containerEl.innerHTML = ''
  containerEl.appendChild(domEl)
}

export const render = ({ scene, camera }: EngineScene): void => {
  if (!renderer) return

  renderer.render(scene, camera)
}
