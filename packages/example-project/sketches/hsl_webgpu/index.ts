import { Node } from 'three/webgpu'
import { hue, uniform, type ShaderNodeObject, saturation } from 'three/tsl'

export default class HSL {
  hue = uniform(0.0)
  saturation = uniform(1)
  luminance = uniform(1.0)

  getWebGPUPass(prevPass: ShaderNodeObject<Node>): ShaderNodeObject<Node> {
    return hue(saturation(prevPass, this.saturation), this.hue).mul(this.luminance)
  }

  update({ params }: { params: { saturation: number; hue: number; luminance: number } }) {
    this.hue.value = params.hue
    this.saturation.value = params.saturation
    this.luminance.value = params.luminance
  }
}
