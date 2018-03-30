import * as THREE from 'three'
import uiEventEmitter from '../utils/uiEventEmitter'
import * as engine from './'
import glslify from 'glslify'
const vert = glslify.file('./src/shaders/simple-vert.glsl')
const frag = glslify.file('./src/shaders/texture-frag.glsl')

let store, renderer, canvas, outputEl, viewerEl, isSendingOutput,
  previewCanvas, rendererWidth, rendererHeight, previewContext

let rttA, rttB, rttCamera, rttScene, rttQuad, rttMaterial

export const setRenderer = () => {
  const settings = store.getState().settings

  renderer = new THREE.WebGLRenderer({
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

  rttMaterial = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      tDiffuseA: { value: rttA.texture },
      tDiffuseB: { value: rttB.texture },
      mixRatio: { value: 0 }
    }
  })

  rttCamera = new THREE.OrthographicCamera(null, null, null, null, -10000, 10000)
  rttScene = new THREE.Scene()
  const plane = new THREE.PlaneBufferGeometry(1, 1)
  rttQuad = new THREE.Mesh(plane, rttMaterial)
  rttScene.add(rttQuad)
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

    // Set canvas width and height attr
    previewCanvas.width = width
    previewCanvas.height = width / ratio
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
  // Set camera size
  rttCamera.left = width / -2
  rttCamera.right = width / 2
  rttCamera.top = height / 2
  rttCamera.bottom = height / -2
  rttCamera.updateProjectionMatrix()
  // Set rtt quad size
  rttQuad.scale.set(width, height, 1)

  // Set ratios for each scene
  const engineScenes = engine.scenes
  for (const key in engineScenes) {
    engineScenes[key].setRatio(ratio)
  }

  // CSS trick to resize canvas
  viewerEl.style.paddingBottom = perc + '%'

  // Set new dimensions so output copying is correct
  rendererWidth = width
  rendererHeight = height
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

  // Setup preview canvas to replace renderer canvas in controls window
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

export const render = (sceneA, sceneB, mixRatio) => {
  rttMaterial.uniforms.mixRatio.value = mixRatio

  renderer.render(sceneA.scene, sceneA.camera, rttA, true)
  renderer.render(sceneB.scene, sceneB.camera, rttB, true)

  renderer.render(rttScene, rttCamera)

  if (isSendingOutput) {
    previewContext.drawImage(renderer.domElement, 0, 0, rendererWidth, rendererHeight)
  }
}
