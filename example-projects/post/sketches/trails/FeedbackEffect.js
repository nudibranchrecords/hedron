const { THREE, postprocessing, glslify } = window.HEDRON.dependencies
const { Uniform, Texture } = THREE
const { Effect, BlendFunction } = postprocessing

const frag = glslify.file('./frag.glsl')

class FeedbackEffect extends Effect {
  constructor ({
    blendFunction = BlendFunction.NORMAL,
  } = {}) {
    super('FeedbackEffect', frag, {
      blendFunction,
      uniforms: new Map([
        ['rotAngle', new Uniform(1)],
        ['scale', new Uniform(1)],
        ['mixAmp', new Uniform(1)],
        ['bufferTexture', new Uniform(Texture)],
      ]),

    })
  }
}

module.exports = FeedbackEffect
