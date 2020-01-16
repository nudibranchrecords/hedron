const { postprocessing } = window.HEDRON.dependencies
const { EffectPass, BloomEffect, BlendFunction, KernelSize } = postprocessing

class Bloom {
  // Here we add our passes to the composer
  initiatePostProcessing () {
    this.bloomEffect = new BloomEffect({
      blendFunction: BlendFunction.SCREEN,
      kernelSize: KernelSize.LARGE,
      useLuminanceFilter: true,
      luminanceThreshold: 0.825,
      luminanceSmoothing: 0.075,
      height: 480,
    })

    // Please refer to the postprocessing documentation to understand how these classes work
    // https://github.com/vanruesc/postprocessing
    const pass = new EffectPass(null, this.bloomEffect)

    // Return the pass in an array
    return [ pass ]
  }

  // This method will be called every frame, just like the usual update method
  update ({ params: p }) {
    this.bloomEffect.blurPass.scale = p.scale
    this.bloomEffect.luminanceMaterial.threshold = p.lumThreshold
    this.bloomEffect.luminanceMaterial.smoothing = p.lumSmoothing
    this.bloomEffect.blendMode.opacity.value = p.opacity
  }
}

module.exports = Bloom

