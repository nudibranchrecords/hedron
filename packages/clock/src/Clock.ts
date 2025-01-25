const BPM = 128
const MS_IN_MINUTE = 60000
const MS_IN_BEAT = MS_IN_MINUTE / BPM
const MS_PER_FRAME = 1000 / 60
const TICK_INTERVAL = MS_PER_FRAME / MS_IN_BEAT

export class Clock {
  private beatDelta: number = 0 // Increments fractionally every frame, at a rate of exactly 1 per beat
  private isRunning: boolean = false
  private startTimestamp: number | null = null
  private beatCount: number = 0

  public tick = (timestamp: number) => {
    if (this.isRunning) {
      if (this.startTimestamp === null) {
        this.startTimestamp = timestamp
      }
      this.beatDelta += TICK_INTERVAL
      this.beatCount = Math.floor(this.beatDelta % 4) + 1

      requestAnimationFrame((t) => {
        this.tick(t)
      })
    }
  }

  get delta() {
    return this.beatDelta
  }

  get beat() {
    return this.beatCount
  }

  public stop = () => {
    this.isRunning = false
  }

  public reset = () => {
    this.beatDelta = 0
    this.beatCount = 0
    this.startTimestamp = null
  }

  public start = () => {
    if (this.isRunning) return false

    this.isRunning = true
    requestAnimationFrame(this.tick)
  }
}
