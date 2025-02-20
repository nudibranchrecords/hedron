import { calculateTrimmedMean } from './utils'

const MS_IN_MINUTE = 60000
const MAX_TAP_INTERVAL = MS_IN_MINUTE / 20
const TAP_ARR_MAX_LEN = 64
const TAP_ARR_TRIM = 0.1
const PPQN = 24

/**
 *  Clock. Maintains a steadily incrementing `beatDelta` value based on the BPM.
 */
export class Clock {
  private _beatDelta: number = 0 // Increments fractionally every frame, at a rate of exactly 1 per beat, used externally for LFO functions, resets on start events
  private _beatPulseComparisonDelta: number = 0 // Same as above, but also resets on continue events, used to keep in time with incoming clock pulses
  private _isRunning: boolean = false
  private _beatCount: number = 0
  private _beatsPerMs: number = 0
  private _bpm: number = 0
  private _lastTimestamp: number | null = null
  private _lastTempoTap: number | null = null
  private _tapIntervals: number[] = []
  private _lastPulseTimestamp: number | null = null
  private _timingPulseCount: number = 0 // Increments every pulse, used to calculate beatPulseOffset, resets on start and continue events
  private _shouldStartOnNextTimingPulse: boolean = false
  private _shouldContinueOnNextTimingPulse: boolean = false
  private _beatPulseOffset: number = 0
  private _smoothedBpm: number = 0
  private _smoothedBeatPulseOffset: number = 0
  private _lastBeatTimestamp: number | null = null

  /**
   * @param bpm Beats per minute
   */
  constructor(bpm: number = 128) {
    this.bpm = bpm
  }

  /**
   * Runs every frame, handles updates of beatDelta and beatCount
   * @param timestamp Timestamp as given by requestAnimationFrame
   */
  private tick = (timestamp: number) => {
    if (this._lastTimestamp == null) {
      throw new Error('Clock: tick() should never happen before start() has been called')
    }

    if (this._isRunning) {
      // Increase the delta.
      // Adjusted by `beatPulseOffset` to keep in time with an external clock, if we have an external clock pulse coming in)
      const deltaInc =
        this._beatsPerMs * (timestamp - this._lastTimestamp) * (1 + this._beatPulseOffset)
      this._beatDelta += deltaInc
      this._beatPulseComparisonDelta += deltaInc
      this._beatCount = Math.floor(this._beatDelta % 4)

      requestAnimationFrame(this.tick)

      this._lastTimestamp = timestamp
    }
  }

  /**
   * Sets the BPM
   * @param bpm Beats per minute.
   */
  set bpm(bpm: number) {
    this._bpm = bpm
    this._beatsPerMs = bpm / MS_IN_MINUTE
  }

  /**
   * Gets the current BPM
   * @returns The current BPM.
   */
  get bpm() {
    return this._bpm
  }

  /**
   * Gets the current beat delta, a value that increments fractionally every frame, at a rate of exactly 1 per beat.
   * @returns The current beat delta
   */
  get beatDelta() {
    return this._beatDelta
  }

  /**
   * Gets the current beat count.
   * @returns The current beat count
   */
  get beatCount() {
    return this._beatCount + 1
  }

  /**
   * Gets the current beat pulse offset, a value indicating how out of sync the `beatDelta` and an incoming clock signal are.
   * This value is used internally to keep in time with incoming clock pulses.
   * @returns The current beat pulse offset
   */
  get beatPulseOffset() {
    return this._beatPulseOffset
  }

  /**
   * Gets the smoothed BPM. Best value to display for users.
   * @returns The smoothed BPM
   */
  get smoothedBpm() {
    return this._smoothedBpm
  }

  /**
   * Gets the smoothed beat pulse offset. Only useful for very detailed output of info (e.g. dev stuff)
   * @returns The smoothed beat pulse offset
   */
  get smoothedBeatPulseOffset() {
    return this._smoothedBeatPulseOffset
  }

  /**
   * Starts the clock. Optionally resets the clock.
   * @param withReset Whether to reset the clock
   */
  public start = (withReset = true) => {
    if (this._isRunning) return

    this._beatPulseComparisonDelta = 0
    this._timingPulseCount = 0

    if (withReset) this.reset()

    this._lastTimestamp = performance.now()
    this._isRunning = true

    requestAnimationFrame(this.tick)
  }

  /**
   * Continues the clock without resetting.
   */
  public continue = () => {
    this.start(false)
  }

  /**
   * Stops the clock.
   */
  public stop = () => {
    this._isRunning = false
  }

  /**
   * Resets the clock.
   */
  public reset = () => {
    this._beatDelta = 0
    this._beatCount = 0
    this._lastTimestamp = performance.now()
    this._lastTempoTap = null
    this._tapIntervals = []
    this._lastPulseTimestamp = null
    this._shouldStartOnNextTimingPulse = false
    this._timingPulseCount = 0
  }

  /**
   * Starts the clock on the next timing pulse. Used for MIDI clock START events.
   */
  public startOnNextTimingPulse = () => {
    if (this._isRunning) return
    this._shouldStartOnNextTimingPulse = true
  }

  /**
   * Continues the clock on the next timing pulse. Used for MIDI clock CONTINUE events.
   */
  public continueOnNextTimingPulse = () => {
    if (this._isRunning) return
    this._shouldContinueOnNextTimingPulse = true
  }

  /**
   * Update the BPM based on a tap event, useful for "tap tempo" feature.
   */
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

    if (this._tapIntervals.length > TAP_ARR_MAX_LEN) {
      this._tapIntervals.shift()
    }

    // For tapping, we want to ignore the fastest and slowest taps
    const averageDelta = calculateTrimmedMean(this._tapIntervals, TAP_ARR_TRIM)
    this.bpm = MS_IN_MINUTE / averageDelta
    this._smoothedBpm = Math.round(MS_IN_MINUTE / averageDelta)

    this._lastTempoTap = now
  }

  /**
   * Update the BPM by sending the clock a timing pulse. Useful for syncing external clocks.
   */
  public sendTimingPulse = () => {
    const now = performance.now()

    if (this._shouldStartOnNextTimingPulse) {
      this._shouldStartOnNextTimingPulse = false

      this.start()
    } else if (this._shouldContinueOnNextTimingPulse) {
      this._shouldContinueOnNextTimingPulse = false

      this.continue()
    } else {
      this._timingPulseCount++
    }

    this._beatPulseOffset = this._timingPulseCount / PPQN - this._beatPulseComparisonDelta

    if (this._lastPulseTimestamp === null) {
      this._lastPulseTimestamp = now
      return
    }

    const delta = now - this._lastPulseTimestamp

    // Don't try and adjust the BPM if multiple clock pulses came at the same time
    if (delta !== 0) {
      this.bpm = MS_IN_MINUTE / (delta * PPQN)
    }

    // Update smoothed BPM once a beat (nice for humans)
    if (this._timingPulseCount % PPQN === 0) {
      if (this._lastBeatTimestamp !== null) {
        const delta = now - this._lastBeatTimestamp
        this._smoothedBpm = Math.round(MS_IN_MINUTE / delta)
      }
      this._lastBeatTimestamp = now
    }

    if (this._lastPulseTimestamp === null) {
      this._lastPulseTimestamp = now
      return
    }

    this._lastPulseTimestamp = now
  }
}
