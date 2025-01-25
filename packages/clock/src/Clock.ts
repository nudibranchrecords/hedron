import { calculateTrimmedMean } from './utils'

const MS_IN_MINUTE = 60000
const MAX_TAPS = 64
const MAX_TAP_INTERVAL = MS_IN_MINUTE / 20
const TAP_ARR_TRIM = 0.1

export class Clock {
  private _beatDelta: number = 0 // Increments fractionally every frame, at a rate of exactly 1 per beat
  private _isRunning: boolean = false
  private _beatCount: number = 0
  private _beatsPerMs: number = 0
  private _bpm: number = 0
  private _lastTimestamp: number | null = null
  private _lastTempoTap: number | null = null
  private _tapIntervals: number[] = []

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
    this._lastTempoTap = null
    this._tapIntervals = []
  }

  public sendTempoTap = () => {
    const now = performance.now()

    if (this._lastTempoTap === null) {
      this._lastTempoTap = now
      return
    }

    const delta = now - this._lastTempoTap

    if (delta > MAX_TAP_INTERVAL) {
      this._lastTempoTap = now
      this._tapIntervals = []
      return
    }

    this._tapIntervals.push(delta)

    if (this._tapIntervals.length > MAX_TAPS) {
      this._tapIntervals.shift()
    }

    // For tapping, we want to ignore the fastest and slowest taps
    const averageDelta = calculateTrimmedMean(this._tapIntervals, TAP_ARR_TRIM)
    this.bpm = Math.round(MS_IN_MINUTE / averageDelta)

    this._lastTempoTap = now
  }
}
