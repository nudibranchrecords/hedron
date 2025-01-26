const PPQN = 24
const MS_IN_MINUTE = 60000

export class MidiClockMock {
  private _bpm: number
  private pulseCallback: (() => void) | null = null
  private lastPulseTime: number = 0
  public isEnabled = false

  constructor(bpm: number) {
    this._bpm = bpm
    this.startLoop()
  }

  get bpm(): number {
    return this._bpm
  }

  set bpm(value: number) {
    this._bpm = value
  }

  onPulse(callback: () => void) {
    this.pulseCallback = callback
  }

  private startLoop() {
    const pulse = (timestamp: number) => {
      const interval = MS_IN_MINUTE / (this.bpm * PPQN)

      if (!this.lastPulseTime) {
        this.lastPulseTime = timestamp
      }
      const elapsed = timestamp - this.lastPulseTime
      if (elapsed >= interval) {
        this.lastPulseTime = timestamp

        if (this.isEnabled) this.pulseCallback?.()
      }

      requestAnimationFrame(pulse)
    }
    requestAnimationFrame(pulse)
  }
}
