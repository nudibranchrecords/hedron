import { PerspectiveCamera, Scene } from 'three'

export class EngineScene {
  public scene: Scene
  public camera: PerspectiveCamera

  constructor() {
    this.scene = new Scene()
    this.camera = new PerspectiveCamera(75, undefined, 0.1, 100000)
    this.camera.position.z = 5
  }

  setRatio(ratio: number): void {
    this.camera.aspect = ratio
    this.camera.updateProjectionMatrix()
  }
}
