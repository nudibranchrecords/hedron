const { EffectPass, ChromaticAberrationEffect, GlitchEffect } = POSTPROCESSING

class Glitch {
  initiatePostProcessing (composer) {
    this.rgbShiftEffect = new ChromaticAberrationEffect()

    this.glitchEffect = new GlitchEffect({
      columns: 0,
      chromaticAberrationOffset: this.rgbShiftEffect.offset,
    })

    const glitchPass = new EffectPass(this.camera, this.glitchEffect)
    const rgbPass = new EffectPass(this.camera, this.rgbShiftEffect)

    composer.addPass(glitchPass)
    composer.addPass(rgbPass)

    // Return the pass that needs to be rendered to the screen
    return rgbPass
  }

  update (p) {
    this.glitchEffect.strength.x = p.glitchAmpStrong
    this.glitchEffect.strength.y = p.glitchAmpWeak
  }
}

module.exports = Glitch

