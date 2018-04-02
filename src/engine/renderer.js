import * as THREE from 'three'
import uiEventEmitter from '../utils/uiEventEmitter'
import * as engine from './'
import QuadScene from './QuadScene'

let store, renderer, canvas, outputEl, viewerEl, isSendingOutput, previewRenderer,
  rendererWidth, rendererHeight, previewCanvas, previewContext

let quadSceneMain, rttA, rttB

export const setRenderer = () => {
  const settings = store.getState().settings

  renderer = new THREE.WebGLRenderer({
    antialias: settings.antialias
  })

  previewRenderer = new THREE.WebGLRenderer({
    antialias: settings.antialias
  })

  canvas = renderer.domElement
  viewerEl.innerHTML = ''
  viewerEl.appendChild(canvas)
  const renderTargetParameters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat,
    stencilBuffer: false
  }
  rttA = new THREE.WebGLRenderTarget(null, null, renderTargetParameters)
  rttB = new THREE.WebGLRenderTarget(null, null, renderTargetParameters)

  quadSceneMain = new QuadScene(rttA, rttB)
}

export const setViewerEl = (el) => {
  viewerEl = el
}

export const setSize = () => {
  const settings = store.getState().settings
  let width, ratio

  if (isSendingOutput) {
    // Get width and ratio from output window
    width = outputEl.offsetWidth
    ratio = width / outputEl.offsetHeight

    previewCanvas.width = width
    previewCanvas.height = width / ratio

    previewRenderer.setSize(viewerEl.offsetWidth, viewerEl.offsetWidth / ratio)
  } else {
    // Basic width and ratio if no output
    width = viewerEl.offsetWidth
    ratio = settings.aspectW / settings.aspectH
  }

  const perc = 100 / ratio
  const height = width / ratio

  renderer.setSize(width, height)

  // Set sizes for render targets
  rttA.setSize(width, height)
  rttB.setSize(width, height)

  // Set sizes for quad scene
  quadSceneMain.setSize(width, height)

  // Set ratios for each scene
  const engineScenes = engine.scenes
  for (const key in engineScenes) {
    engineScenes[key].setRatio(ratio)
  }

  rendererWidth = width
  rendererHeight = height

  // CSS trick to resize canvas
  viewerEl.style.paddingBottom = perc + '%'
}

export const initiate = (injectedStore) => {
  store = injectedStore

  uiEventEmitter.on('reset-renderer', () => {
    setRenderer()
  })
  uiEventEmitter.on('repaint', () => {
    setSize()
  })

  setRenderer()
  setSize()
}

export const setOutput = (win) => {
  stopOutput()
  const container = win.document.querySelector('div')

  rendererHeight = container.offsetWidth
  rendererWidth = container.offsetHeight
  outputEl = container

  // Move renderer canvas to new window
  outputEl.appendChild(canvas)
  canvas.setAttribute('style', '')

  // Setup preview renderer in dom
  viewerEl.appendChild(previewRenderer.domElement)

  // Setup preview canvas in dom
  // This is used when outputting and dont need to preview other channels,
  // can directly copy the image from the output canvas
  previewCanvas = document.createElement('canvas')
  previewCanvas.style = 'position: absolute; left: 0; height: 0; width:100%; height:100%;'
  previewContext = previewCanvas.getContext('2d')
  viewerEl.appendChild(previewCanvas)

  isSendingOutput = true

  setSize()

  win.addEventListener('resize', () => {
    uiEventEmitter.emit('repaint')
  })
}

export const stopOutput = () => {
  viewerEl.innerHTML = ''
  canvas.setAttribute('style', '')
  viewerEl.appendChild(canvas)

  isSendingOutput = false

  setSize()
}

const renderChannels = (renderer, sceneA, sceneB, mixState) => {
  switch (mixState) {
    case 'A':
      sceneA && renderer.render(sceneA.scene, sceneA.camera)
      break
    case 'B':
      sceneB && renderer.render(sceneB.scene, sceneB.camera)
      break
    default:
      sceneA && renderer.render(sceneA.scene, sceneA.camera, rttA, true)
      sceneB && renderer.render(sceneB.scene, sceneB.camera, rttB, true)
      renderer.render(quadSceneMain.scene, quadSceneMain.camera)
      break

  }
}

const renderSingle = (renderer, viewerRenderer, mixState, scene, channel) => {
  if (isSendingOutput && mixState === channel) {
    previewCanvas.style.display = 'block'
    previewContext.drawImage(renderer.domElement, 0, 0, rendererWidth, rendererHeight)
  } else {
    if (previewCanvas) previewCanvas.style.display = 'none'
    viewerRenderer.render(scene.scene, scene.camera)
  }
}

export const render = (sceneA, sceneB, mixRatio, viewerMode) => {
  quadSceneMain.material.uniforms.mixRatio.value = mixRatio
  let mixState

  if (mixRatio === 0) {
    mixState = 'A'
  } else if (mixRatio === 1) {
    mixState = 'B'
  }

  let viewerRenderer = renderer

  if (isSendingOutput) {
    viewerRenderer = previewRenderer

    renderChannels(renderer, sceneA, sceneB, mixState)
  }

  switch (viewerMode) {
    case 'mix':
      if (isSendingOutput) {
        previewCanvas.style.display = 'block'
        previewContext.drawImage(renderer.domElement, 0, 0, rendererWidth, rendererHeight)
      } else {
        if (previewCanvas) previewCanvas.style.display = 'none'
        renderChannels(viewerRenderer, sceneA, sceneB, mixState)
      }
      break
    case 'A':
      renderSingle(renderer, viewerRenderer, mixState, sceneA, 'A')
      break
    case 'B':
      renderSingle(renderer, viewerRenderer, mixState, sceneB, 'B')
      break
  }
}
