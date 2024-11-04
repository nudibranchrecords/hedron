import { Pass, RenderPass } from 'postprocessing'
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'

export class EngineScene {
  public scene: Scene
  public camera: PerspectiveCamera
  public passes: Pass[]
  private renderPass: RenderPass
  public renderer: WebGLRenderer | null = null

  constructor() {
    this.scene = new Scene()
    this.camera = new PerspectiveCamera(75, undefined, 0.1, 100000)
    this.camera.position.z = 5
    this.renderPass = new RenderPass(this.scene, this.camera)
    this.passes = [this.renderPass]
  }

  setRatio(ratio: number): void {
    this.camera.aspect = ratio
    this.camera.updateProjectionMatrix()
  }

  addPass(pass: Pass): void {
    this.passes.push(pass)
  }

  clearPasses(): void {
    this.passes = [this.renderPass]
  }
}
