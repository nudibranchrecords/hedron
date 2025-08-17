import { Pass, RenderPass } from 'postprocessing'
import { PerspectiveCamera, Scene } from 'three'
import { pass, type ShaderNodeObject } from 'three/tsl'
import { PassNode, PostProcessing } from 'three/webgpu'
import { SketchInstanceError, SketchInstanceMap } from '@world/SketchManager'
import { RendererType } from '@HedronEngine/types'

export class EngineScene {
  public scene: Scene
  public camera: PerspectiveCamera
  public passes: Pass[] | undefined
  public sketches: SketchInstanceMap = new Map()
  private renderPass: RenderPass | undefined
  private renderPass_webGPU: ShaderNodeObject<PassNode> | undefined
  public rendererType: RendererType
  private onSketchInstanceError: SketchInstanceError

  constructor({
    rendererType,
    onSketchInstanceError,
  }: {
    rendererType: RendererType
    onSketchInstanceError: SketchInstanceError
  }) {
    this.rendererType = rendererType
    this.onSketchInstanceError = onSketchInstanceError
    this.scene = new Scene()
    this.camera = new PerspectiveCamera(75, undefined, 0.1, 100000)
    this.camera.position.z = 5
    this.rendererType = rendererType

    if (this.rendererType === 'webgpu') {
      this.renderPass_webGPU = pass(this.scene, this.camera)
    } else {
      this.renderPass = new RenderPass(this.scene, this.camera)
      this.passes = [this.renderPass]
    }
  }

  setRatio(ratio: number): void {
    this.camera.aspect = ratio
    this.camera.updateProjectionMatrix()
  }

  addPass(pass: Pass): void {
    if (!this.passes) {
      console.warn('[HEDRON] ⚠️ You are trying to add webGL passes in webGPU mode.')
      return
    }
    this.passes.push(pass)
  }

  clearPasses(): void {
    if (!this.passes || !this.renderPass) {
      console.warn('[HEDRON] ⚠️ You are trying to clear webGL passes in webGPU mode.')
      return
    }
    this.passes = [this.renderPass]
  }

  updateWebGPUPasses(sketchInstances: SketchInstanceMap, postProcessing: PostProcessing): void {
    if (this.rendererType !== 'webgpu') {
      console.warn('[HEDRON] ⚠️ WebGPU pass handling is only available in WebGPU mode.')
      return
    }

    let prevPass = this.renderPass_webGPU!

    sketchInstances.forEach((sketchInstance) => {
      if (sketchInstance.getWebGPUPass) {
        try {
          const nextPass = sketchInstance.getWebGPUPass(prevPass)
          prevPass = nextPass
        } catch (error) {
          this.onSketchInstanceError(sketchInstance.id)
          console.error(`Error getting WebGPU pass for sketch instance ${sketchInstance.id}`, error)
        }
      }
    })

    postProcessing.outputNode = prevPass
    postProcessing.needsUpdate = true
  }
}
