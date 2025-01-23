export class Clock {
  public isRunning: boolean = false
  public delta: number = 0

  public tick = () => {
    if (this.isRunning) {
      this.delta += 0.1
      requestAnimationFrame(this.tick)
    }
  }

  public stop = () => {
    this.isRunning = false
  }

  public start = () => {
    if (this.isRunning) return false

    this.isRunning = true
    requestAnimationFrame(this.tick)
  }
}
