const { EffectPass, ChromaticAberrationEffect, GlitchEffect } = POSTPROCESSING

class Glitch {
  initiatePostProcessing (composer) {
    this.rgbShiftEffect = new ChromaticAberrationEffect()

    this.glitchEffect = new GlitchEffect({
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
    this.glitchEffect.delay.x = p.delayMin * 1000
    this.glitchEffect.delay.y = p.delayMax * 1000

    this.glitchEffect.duration.x = p.durationMin * 1000
    this.glitchEffect.duration.y = p.durationMax * 1000

    this.glitchEffect.strength.x = p.glitchAmpStrong
    this.glitchEffect.strength.y = p.glitchAmpWeak
    this.glitchEffect.ratio = p.strongWeakRatio

    this.glitchEffect.uniforms.get('columns').value = p.columns
  }
}

module.exports = Glitch

