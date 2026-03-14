import { Pass, RenderPass } from 'postprocessing'
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { pass, type ShaderNodeObject } from 'three/tsl'
import { PassNode, PostProcessing, WebGPURenderer } from 'three/webgpu'
import { SketchInstanceError, SketchInstanceMap } from '@world/SketchManager'
import { RendererType } from '@HedronEngine/types'

export class EngineScene {
  public scene: Scene
  private _camera: PerspectiveCamera
  public get camera(): PerspectiveCamera {
    return this._camera
  }
  public set camera(newCamera: PerspectiveCamera) {
    this._camera = newCamera
    if (this.rendererType === 'webgpu' && this.renderPass_webGPU?.camera) {
      this.renderPass_webGPU.camera = newCamera
      return
    }
    if (this.rendererType === 'webgl' && this.renderPass) {
      this.renderPass.mainCamera = this._camera
    }
  }
  public passes: Pass[] | undefined
  public sketches: SketchInstanceMap = new Map()
  private renderPass: RenderPass | undefined
  private renderPass_webGPU: ShaderNodeObject<PassNode> | undefined
  public renderer: WebGLRenderer | WebGPURenderer
  public rendererType: RendererType
  private onSketchInstanceError: SketchInstanceError

  constructor({
    rendererType,
    onSketchInstanceError,
    renderer,
  }: {
    rendererType: RendererType
    onSketchInstanceError: SketchInstanceError
    renderer: WebGLRenderer | WebGPURenderer
  }) {
    this.renderer = renderer
    this.rendererType = rendererType
    this.onSketchInstanceError = onSketchInstanceError
    this.scene = new Scene()
    this._camera = new PerspectiveCamera(75, undefined, 0.1, 100000)
    this._camera.position.z = 5
    this.rendererType = rendererType

    if (this.rendererType === 'webgpu') {
      this.renderPass_webGPU = pass(this.scene, this._camera)
    } else {
      this.renderPass = new RenderPass(this.scene, this._camera)
      this.passes = [this.renderPass]
    }
  }

  setRatio(ratio: number): void {
    this._camera.aspect = ratio
    this._camera.updateProjectionMatrix()
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

    const renderPassNode = this.renderPass_webGPU!
    let prevPass: ShaderNodeObject<PassNode> = renderPassNode

    sketchInstances.forEach((sketchInstance) => {
      if (sketchInstance.getWebGPUPass) {
        try {
          const nextPass = sketchInstance.getWebGPUPass(prevPass, renderPassNode)
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
