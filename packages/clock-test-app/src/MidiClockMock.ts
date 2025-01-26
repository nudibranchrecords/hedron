const PPQN = 24
const MS_IN_MINUTE = 60000

export class MidiClockMock {
  private _bpm: number = 0
  private pulseCallback: (() => void) | null = null
  private _pulseInterval: number = 0
  private _lastPulseTimestamp: number | null = null
  public isEnabled = false

  constructor(bpm: number) {
    this.bpm = bpm
    this.startLoop()
  }

  get bpm(): number {
    return this._bpm
  }

  set bpm(value: number) {
    this._bpm = value
    this._pulseInterval = MS_IN_MINUTE / (this._bpm * PPQN)
  }

  onPulse(callback: () => void) {
    this.pulseCallback = callback
  }

  private startLoop() {
    const pulse = () => {
      if (this._lastPulseTimestamp === null) {
        this._lastPulseTimestamp = performance.now()
        return
      }

      const now = performance.now()
      const delta = now - this._lastPulseTimestamp

      if (delta > this._pulseInterval) {
        const extraMs = delta - this._pulseInterval

        // Subtract extraMs to correct the timestamp
        this._lastPulseTimestamp = now - extraMs
        if (this.isEnabled) this.pulseCallback?.()
      }
    }

    setInterval(pulse, 0)
  }
}
