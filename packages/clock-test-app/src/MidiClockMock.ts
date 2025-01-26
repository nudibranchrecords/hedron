const PPQN = 24
const MS_IN_MINUTE = 60000

export class MidiClockMock {
  private _bpm: number = 0
  private pulseCallback: (() => void) | null = null
  private interval: number = 0
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
    this.interval = MS_IN_MINUTE / (this._bpm * PPQN)
  }

  onPulse(callback: () => void) {
    this.pulseCallback = callback
  }

  private startLoop() {
    const pulse = () => {
      if (this.isEnabled) this.pulseCallback?.()
      setTimeout(pulse, this.interval)
    }
    pulse()
  }
}
