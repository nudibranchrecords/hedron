const { postprocessing } = window.HEDRON.dependencies
const { EffectPass, SavePass, TextureEffect } = postprocessing
const FeedbackEffect = require('./FeedbackEffect')

class Trails {
  initiatePostProcessing ({ composer }) {
    this.feedbackEffect = new FeedbackEffect()

    const savePass = new SavePass()

    this.feedbackEffect.uniforms.get('bufferTexture').value = savePass.renderTarget.texture

    const textureEffect = new TextureEffect({
      texture: savePass.renderTarget.texture,
    })

    const feedbackPass = new EffectPass(null, this.feedbackEffect)
    const texturePass = new EffectPass(null, textureEffect)

    composer.addPass(feedbackPass)
    composer.addPass(savePass)
    composer.addPass(texturePass)

    return texturePass
  }

  updatePostProcessing ({ params: p }) {
    this.feedbackEffect.uniforms.get('scale').value = p.scale
    this.feedbackEffect.uniforms.get('rotAngle').value = p.rotAngle
    this.feedbackEffect.uniforms.get('mixAmp').value = p.mixAmp
  }
}

module.exports = Trails

