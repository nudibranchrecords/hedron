const { THREE, postprocessing } = window.HEDRON.dependencies
const { EffectComposer, RenderPass, SavePass, TextureEffect, EffectPass } = postprocessing

import uiEventEmitter from '../utils/uiEventEmitter'
import * as engine from './'

import getScenes from '../selectors/getScenes'
import getChannelScene from '../selectors/getChannelScene'

let store, domEl, outputEl, viewerEl, isSendingOutput, rendererWidth, rendererHeight,
  previewCanvas, previewContext, outputCanvas, outputContext

let blendOpacity
let delta

const blankScene = { scene: new THREE.Scene(), camera: new THREE.Camera() }

const channels = {
  'A': blankScene,
  'B': blankScene,
}

const getRenderChannelScene = channel => channels[channel] || blankScene

const channelPasses = {
  'A': [],
  'B': [],
}

const channelTextureEffect = {
  A: null,
  B: null,
}

export let renderer, composer, renderPassA, renderPassB

export const setRenderer = () => {
  renderer = new THREE.WebGLRenderer({
    antialias: false, // antialiasing should be handled by the composer
  })

  domEl = renderer.domElement
  viewerEl.innerHTML = ''
  viewerEl.appendChild(domEl)
  composer = new EffectComposer(renderer)
}

export const channelUpdate = (scene, channel) => {
  channels[channel] = scene
  const passes = channelPasses[channel]

  if (passes && passes.length) {
    if (scene) {
      channelPasses[channel][0].scene = scene.scene
      channelPasses[channel][0].camera = scene.camera
    } else {
      channelPasses[channel] = []
    }
  }
}

export const setPostProcessing = () => {
  const state = store.getState()
  const stateScenes = getScenes(state)

  composer.reset()

  // Go through "A" and "B"
  Object.keys(channels).forEach(c => {
    const chan = getRenderChannelScene(c)

    // Each channel has a set of passes
    channelPasses[c] = []

    // Render each channel as a pass
    channelPasses[c].push(new RenderPass(chan.scene, chan.camera))

    // Each channel will also have their final pass saved to a texture to be mixed
    const savePass = new SavePass()
    channelTextureEffect[c] = new TextureEffect({ texture: savePass.renderTarget.texture })

    const stateScene = getChannelScene(state, c)

    // Add any sketch passes, if they're not global
    if (stateScene) {
      stateScene.sketchIds.forEach(sketchId => {
        const module = engine.sketches[sketchId]
        if (!stateScene.settings.globalPostProcessingEnabled && module.initiatePostProcessing) {
          const passes = module.initiatePostProcessing() || []
          channelPasses[c].push(...passes)
        }
      })
    }

    // Save the final output of this channel
    channelPasses[c].push(savePass)

    // Add all of the channel passes to the composer
    channelPasses[c].forEach(pass => composer.addPass(pass))
  })

  // Mix the two channels
  const mixPass = new EffectPass(null, channelTextureEffect.A, channelTextureEffect.B)
  mixPass.renderToScreen = true
  composer.addPass(mixPass)

  const globalPasses = []

  // Loop through all scenes and check for postprocessing
  stateScenes.forEach(scene => {
    scene.sketchIds.forEach(sketchId => {
      const module = engine.sketches[sketchId]
      if (scene.settings.globalPostProcessingEnabled && module.initiatePostProcessing) {
        // Add global passes
        const passes = module.initiatePostProcessing() || []
        globalPasses.push(...passes)
      }
    })
  })

  // Add global passes to composer and set last pass to render to the screen
  if (globalPasses.length) {
    globalPasses.forEach(pass => { composer.addPass(pass) })
    mixPass.renderToScreen = false
    globalPasses[globalPasses.length - 1].renderToScreen = true
  }

  // The channel mix value will will be set to channelB's opacity
  blendOpacity = channelTextureEffect.B.blendMode.opacity
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

    composer.setSize(viewerEl.offsetWidth, viewerEl.offsetWidth / ratio)
  } else {
    // Basic width and ratio if no output
    width = viewerEl.offsetWidth
    ratio = settings.aspectW / settings.aspectH
  }

  const perc = 100 / ratio
  const height = width / ratio

  composer.setSize(width, height)

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
  composer.render(delta)
}

const renderSingle = (disableChannel, mixRatio) => {
  channelPasses[disableChannel].forEach(pass => { pass.enabled = false })

  if (blendOpacity) blendOpacity.value = mixRatio
  composer.render(delta)
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
