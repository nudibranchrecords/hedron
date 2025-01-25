const MS_IN_MINUTE = 60000

export class Clock {
  private _beatDelta: number = 0 // Increments fractionally every frame, at a rate of exactly 1 per beat
  private _isRunning: boolean = false
  private _beatCount: number = 0
  private _beatsPerMs: number = 0
  private _bpm: number = 0
  private _lastTimestamp: number | null = null
  private _lastTempoTap: number | null = null

  constructor(bpm: number = 128) {
    this.bpm = bpm
  }

  private tick = (timestamp: number) => {
    if (this._lastTimestamp == null) {
      throw new Error('Clock: tick() should never happen before start() has been called')
    }

    if (this._isRunning) {
      this._beatDelta += this._beatsPerMs * (timestamp - this._lastTimestamp)
      this._beatCount = Math.floor(this._beatDelta % 4) + 1

      requestAnimationFrame(this.tick)

      this._lastTimestamp = timestamp
    }
  }

  set bpm(bpm: number) {
    this._bpm = bpm
    this._beatsPerMs = bpm / MS_IN_MINUTE
  }

  get bpm() {
    return this._bpm
  }

  get beatDelta() {
    return this._beatDelta
  }

  get beatCount() {
    return this._beatCount
  }

  public start = () => {
    if (this._isRunning) return false

    this._lastTimestamp = performance.now()
    this._isRunning = true

    requestAnimationFrame(this.tick)
  }

  public stop = () => {
    this._isRunning = false
  }

  public reset = () => {
    this._beatDelta = 0
    this._beatCount = 0
    this._lastTimestamp = performance.now()
  }

  public sendTempoTap = () => {
    const now = performance.now()

    if (this._lastTempoTap === null) {
      this._lastTempoTap = now
      return
    }

    const delta = now - this._lastTempoTap

    this.bpm = MS_IN_MINUTE / delta
    this._lastTempoTap = now
  }
}
