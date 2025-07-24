import { PassNode, ShaderNodeObject } from 'three/webgpu'

export default class HSL {
  getWebGPUPass(prevPass: ShaderNodeObject<PassNode>): ShaderNodeObject<PassNode> {
    // const dotScreenPass = dotScreen(prevPass.getTextureNode())
    return prevPass.mul(1)
  }

  update() {}
}
