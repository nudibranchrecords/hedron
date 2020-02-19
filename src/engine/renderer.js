import * as THREE from 'three'
import { EffectComposer, RenderPass, SavePass, TextureEffect, EffectPass, ClearPass, Pass } from 'postprocessing'

import getSketchParams from '../selectors/getSketchParams'

import uiEventEmitter from '../utils/uiEventEmitter'
import * as engine from './'

import getScenes from '../selectors/getScenes'

let store, domEl, outputEl, viewerEl, isSendingOutput, rendererWidth, rendererHeight,
  previewCanvas, previewContext, outputCanvas, outputContext

let blendOpacity
let delta

const renderScenes = new Map()

const channelPasses = {
  'A': [],
  'B': [],
}

class CallbackPass extends Pass {
  constructor (callback) {
    super('CallbackPass')

    this.callback = callback

    this.needsDepthTexture = true
    this.needsSwap = false

    return
  }

  render (renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    this.callback(renderer)
  }
}

export let renderer, composer

// Store renderer size as an object
export const size = { width: 0, height: 0 }

const blankTexture = new THREE.Texture()

const channelTextureEffect = {
  A: new TextureEffect({ texture: blankTexture }),
  B: new TextureEffect({ texture: blankTexture }),
}

export const setRenderer = () => {
  renderer = new THREE.WebGLRenderer({
    antialias: false, // antialiasing should be handled by the composer
  })

  domEl = renderer.domElement
  viewerEl.innerHTML = ''
  viewerEl.appendChild(domEl)
  composer = new EffectComposer(renderer)
}

export const channelUpdate = (sceneId, c) => {
  // Disable previous passes in channel
  channelPasses[c].forEach(pass => { pass.enabled = false })
  channelPasses[c] = []

  if (!sceneId) {
    channelTextureEffect[c].uniforms.get('texture').value = blankTexture
    return
  }

  const renderScene = renderScenes.get(sceneId)

  // Set new passes for the channel and enable them
  channelPasses[c] = renderScene.passes
  renderScene.passes.forEach(pass => { pass.enabled = true })

  // Set output texture for the channel
  channelTextureEffect[c].uniforms.get('texture').value = renderScene.outputTexture
}

export const getSketchPasses = (state, sketchId, hedronScene) => {
  const module = engine.sketches[sketchId]

  if (module.initiatePostProcessing) {
    const params = getSketchParams(state, sketchId)

    return module.initiatePostProcessing({
      scene: hedronScene.scene,
      camera: hedronScene.camera,
      params,
      sketchesDir: `file://${engine.sketchesDir}`,
      composer,
      outputSize: size,
    }) || []
  } else {
    return []
  }
}

export const sceneRenderSetup = (hedronScene, passes) => {
  const renderScene = {
    passes: [],
    outputTexture: null,
  }

  if (hedronScene.scene.children.length > 0) {
    // Render the scene if it has anything to render
    renderScene.passes.push(new RenderPass(hedronScene.scene, hedronScene.camera))
  } else {
    // Otherwise just clear the buffer
    renderScene.passes.push(new ClearPass())
  }

  const renderMethods = hedronScene.renderMethods.values()
  for (const renderMethod of renderMethods) {
    renderScene.passes.push(new CallbackPass(renderMethod))
  }

  // Add all custom passes
  renderScene.passes.push(...passes)

  // Channel will also have the final pass saved to a texture to be mixed
  const savePass = new SavePass()
  renderScene.passes.push(savePass)
  renderScene.outputTexture = savePass.renderTarget.texture

  return renderScene
}

export const setPostProcessing = () => {
  const state = store.getState()
  const stateScenes = getScenes(state)

  composer.reset()

  const globalPasses = []

  // Loop through all scenes and check for postprocessing
  stateScenes.forEach(stateScene => {
    const hedronScene = engine.scenes[stateScene.id]
    const localPasses = []
    stateScene.sketchIds.forEach(sketchId => {
      const passes = getSketchPasses(state, sketchId, hedronScene)
      if (stateScene.settings.globalPostProcessingEnabled) {
        // If global, add to global passes list to be added to composer later
        globalPasses.push(...passes)
      } else {
        // Otherwise add to local passes to be added now
        localPasses.push(...passes)
      }
    })

    const renderScene = sceneRenderSetup(hedronScene, localPasses)
    renderScene.passes.forEach(pass => {
      composer.addPass(pass)
      // Disable all passes (will be enabled if added to channel)
      pass.enabled = false
    })
    renderScenes.set(
      stateScene.id,
      renderScene
    )
  })

  // Mix the two channels
  const mixPass = new EffectPass(null, channelTextureEffect.A, channelTextureEffect.B)
  mixPass.renderToScreen = true
  composer.addPass(mixPass)

  // Add global passes to composer and set last pass to render to the screen
  if (globalPasses.length) {
    globalPasses.forEach(pass => { composer.addPass(pass) })
    mixPass.renderToScreen = false
    globalPasses[globalPasses.length - 1].renderToScreen = true
  }

  // The channel mix value will will be set to channelB's opacity
  blendOpacity = channelTextureEffect.B.blendMode.opacity

  // Set up channels
  channelUpdate(state.scenes.channels.A, 'A')
  channelUpdate(state.scenes.channels.B, 'B')
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

    outputCanvas.width = width
    outputCanvas.height = width / ratio
  } else {
    // Basic width and ratio if no output
    width = viewerEl.offsetWidth
    ratio = settings.aspectW / settings.aspectH
  }

  const perc = 100 / ratio
  const height = width / ratio

  composer.setSize(width, height)
  size.width = width
  size.height = height

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
  outputEl.appendChild(domEl)
  domEl.setAttribute('style', '')

  // Setup output canvas
  // If preview and output are different, this canvas will be used and
  // renderer renders two different images, with images being copied from
  // the dom element to both preview and output canvases
  outputCanvas = document.createElement('canvas')
  outputCanvas.style = 'position: absolute; left: 0; top:0; height: 0; width:100%; height:100%;'
  outputContext = outputCanvas.getContext('2d')
  outputEl.appendChild(outputCanvas)

  // Setup preview canvas in dom
  // Pixels will be copied from renderer dom element to this
  previewCanvas = document.createElement('canvas')
  previewCanvas.style = 'position: absolute; left: 0; top:0; height: 0; width:100%; height:100%;'
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
  domEl.setAttribute('style', '')
  viewerEl.appendChild(domEl)

  isSendingOutput = false

  setSize()
}

const renderChannels = (mixRatio) => {
  if (blendOpacity) blendOpacity.value = mixRatio
  composer.render(delta / 1000)
}

const renderSingle = (disableChannel, mixRatio) => {
  channelPasses[disableChannel].forEach(pass => { pass.enabled = false })

  if (blendOpacity) blendOpacity.value = mixRatio
  composer.render(delta / 1000)
}

const renderLogic = (viewerMode, mixRatio) => {
  channelPasses['A'].forEach(pass => { pass.enabled = true })
  channelPasses['B'].forEach(pass => { pass.enabled = true })

  switch (viewerMode) {
    case 'A':
      renderSingle('B', 0)
      break
    case 'B':
      renderSingle('A', 1)
      break
    default:
      renderChannels(mixRatio)
  }
}

const copyPixels = (context) => {
  context.drawImage(renderer.domElement, 0, 0, rendererWidth, rendererHeight)
}

export const render = (mixRatio, viewerMode, deltaIn) => {
  delta = deltaIn

  // mixState helps with performance. If mixer is all the way to A or B
  // we can stop rendering of opposite channel
  let mixState = 'mix'
  if (mixRatio === 0) {
    mixState = 'A'
  } else if (mixRatio === 1) {
    mixState = 'B'
  }

  if (!isSendingOutput) {
    // Always using dom element when not outputting
    if (previewCanvas) previewCanvas.style.display = 'none'
    if (viewerMode === 'mix') {
      renderLogic(mixState, mixRatio)
    } else {
      renderLogic(viewerMode, mixRatio)
    }
  } else {
    // When outputting, need the preview canvas
    if (previewCanvas) previewCanvas.style.display = 'block'
    // mix and preview viewer are the same
    if (viewerMode === 'mix' || mixState === viewerMode) {
      // No need for output canvas
      outputCanvas.style.display = 'none'
      // Render the correct thing
      renderLogic(mixState, mixRatio)
      // Copy pixels to preview
      copyPixels(previewContext)
    } else {
      // mix and preview are not the same
      // Show output canvas
      outputCanvas.style.display = 'block'

      // Render for output
      renderLogic(mixState, mixRatio)
      // Copy pixels to output canvas
      copyPixels(outputContext)
      // Render for preview
      renderLogic(viewerMode, mixRatio)
      // Copy pixels to preview canvas
      copyPixels(previewContext)
    }
  }
}
