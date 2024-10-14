import { Pass, ShaderPass } from 'postprocessing'
import { Uniform, Texture, ShaderMaterial, Vector3 } from 'three'

import fragmentShader from './hsl.glsl'

/**
 * A basic post proicessing effect to adjust the hue, saturation, and lightness of the scene.
 * While this could be created with existing postprocessing passes, this example demonstrates how to create a custom effect.
 */
export default class HSL {
  shader: ShaderMaterial
  pass: ShaderPass
  passes: Pass[]

  /**
   * Gets the passes for this effect.
   * This function is called by Hedron to get the passes for this effect.
   * Passes are added to the scenes EffectComposer
   * This function is currently called every frame, so be sure to cache the passes.
   * You can also modify the pass list at any time, and Hedron will update the scene accordingly.
   */
  getPasses(): Pass[] {
    if (!this.passes) {
      this.createPasses()
    }
    return this.passes
  }

  createPasses() {
    this.shader = this.createBloom()
    this.pass = new ShaderPass(this.shader, 'u_texture')
    this.passes = [this.pass]
  }

  createBloom(): ShaderMaterial {
    const uniforms = [
      ['u_hsl', new Uniform(new Vector3(0.0, 1.0, 1.0))],
      ['u_texture', new Uniform(Texture)],
    ]

    return new ShaderMaterial({
      uniforms: Object.fromEntries(uniforms),
      vertexShader: `
		varying vec2 vUv;
		void main() {
		    vUv = uv;
		    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	    }`,
      fragmentShader,
    })
  }

  /**
   * Called by Hedron every frame with the current parameters.
   */
  update({ params }) {
    this.setUniform('u_hsl', new Vector3(params.hue, params.saturation, params.lightness))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setUniform(key: string, value: any) {
    if (this.shader.uniforms[key]) {
      this.shader.uniforms[key].value = value
    }
  }

  /**
   * The function can be used instead of a seperate config.js/ts file
   * @returns The configuration for this effect.
   */
  getConfig() {
    return {
      title: 'HSL',
      description: 'Hue, Saturation, Lightness',
      category: 'simple',
      params: [
        {
          title: 'Hue',
          key: 'hue',
          defaultValue: 0.0,
          defaultMin: 0.0,
          defaultMax: 1.0,
        },
        {
          title: 'Saturation',
          key: 'saturation',
          defaultValue: 1.0,
          defaultMin: 0.0,
          defaultMax: 1.0,
        },
        {
          title: 'Lightness',
          key: 'lightness',
          defaultValue: 1.0,
          defaultMin: 0.0,
          defaultMax: 1.0,
        },
      ],
    }
  }
}
