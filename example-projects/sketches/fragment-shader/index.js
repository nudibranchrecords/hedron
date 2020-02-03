const { postprocessing, glslify, THREE } = window.HEDRON.dependencies
const { Uniform } = THREE
const { EffectPass, Effect } = postprocessing

const fragmentShader = glslify.file('./frag.glsl')

class FragmentShader {
  initiatePostProcessing ({ params }) {
    // Define all params as uniforms
    const paramUniforms = Object.entries(params).map(
      ([key, value]) => [key, new Uniform(value)]
    )

    class PatternEffect extends Effect {
      constructor () {
        super('PatternEffect', fragmentShader, {
          uniforms: new Map([
            ...paramUniforms,
          ]),
        })
      }
    }

    this.effect = new PatternEffect()

    return [ new EffectPass(null, this.effect) ]
  }

  update ({ params }) {
    // Update all uniforms using params
    for (const [key, value] of Object.entries(params)) {
      this.effect.uniforms.get(key).value = value
    }
  }
}

module.exports = FragmentShader

