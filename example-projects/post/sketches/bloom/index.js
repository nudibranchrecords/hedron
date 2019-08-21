const { EffectPass, BloomEffect, BlendFunction, KernelSize } = POSTPROCESSING

class Glitch {
  initiatePostProcessing (composer) {
    this.bloomEffect = new BloomEffect({
      blendFunction: BlendFunction.SCREEN,
      kernelSize: KernelSize.LARGE,
      useLuminanceFilter: true,
      luminanceThreshold: 0.825,
      luminanceSmoothing: 0.075,
      height: 480,
    })

    const pass = new EffectPass(null, this.bloomEffect)
    composer.addPass(pass)

    // Return the pass that needs to be rendered to the screen
    return pass
  }

  updatePostProcessing (p) {
    this.bloomEffect.blurPass.scale = p.scale
    this.bloomEffect.luminanceMaterial.threshold = p.lumThreshold
    this.bloomEffect.luminanceMaterial.smoothing = p.lumSmoothing
    this.bloomEffect.blendMode.opacity.value = p.opacity
  }
}

module.exports = Glitch

