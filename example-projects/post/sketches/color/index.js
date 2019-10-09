const { postprocessing } = window.HEDRON.dependencies
const { EffectPass, BrightnessContrastEffect, GammaCorrectionEffect, HueSaturationEffect } = postprocessing

class Color {
  initiatePostProcessing (composer) {
    this.brightnessContrastEffect = new BrightnessContrastEffect()
    this.gammaCorrectionEffect = new GammaCorrectionEffect()
    this.hueSaturationEffect = new HueSaturationEffect()

    const pass = new EffectPass(null,
      this.brightnessContrastEffect,
      this.gammaCorrectionEffect,
      this.hueSaturationEffect
    )

    composer.addPass(pass)

    // Return the pass that needs to be rendered to the screen
    return pass
  }

  updatePostProcessing (p) {
    this.brightnessContrastEffect.uniforms.get('brightness').value = p.brightness
    this.brightnessContrastEffect.uniforms.get('contrast').value = p.contrast
    this.brightnessContrastEffect.blendMode.opacity.value = p.brightnessContrastOpacity

    this.gammaCorrectionEffect.uniforms.get('gamma').value = p.gamma
    this.gammaCorrectionEffect.blendMode.opacity.value = p.gammaOpacity

    this.hueSaturationEffect.setHue(p.hue)
    this.hueSaturationEffect.uniforms.get('saturation').value = p.saturation
    this.hueSaturationEffect.blendMode.opacity.value = p.hueSaturationOpacity
  }
}

module.exports = Color

