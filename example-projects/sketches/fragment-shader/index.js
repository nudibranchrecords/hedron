const { THREE, postprocessing, glslify } = window.HEDRON.dependencies
const { ShaderPass } = postprocessing
const { ShaderMaterial, Uniform, Vector2 } = THREE

const vertexShader = glslify.file('./vert.glsl')
const fragmentShader = glslify.file('./frag.glsl')

class FragmentShader {
  initiatePostProcessing () {
    this.mat = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        resolution: new Uniform(new Vector2()),
        time: new Uniform(0),
      },
    })

    return [ new ShaderPass(this.mat) ]
  }

  update ({ params: p, elapsedTimeMs, outputSize }) {
    this.mat.uniforms.resolution.value = [outputSize.width, outputSize.height]
    this.mat.uniforms.time.value = elapsedTimeMs
  }
}

module.exports = FragmentShader

