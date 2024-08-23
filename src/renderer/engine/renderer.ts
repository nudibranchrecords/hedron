import { WebGLRenderer } from 'three'

export const createCanvas = (containerEl: HTMLDivElement): void => {
  const renderer = new WebGLRenderer({
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
