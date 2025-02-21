import c from './ClockDisplay.module.css'
import { Button } from '@components/core/Button/Button'

export interface ClockDisplayProps {
  bpm: number
  beat: number
  onTapClick: () => void
  onResetClick: () => void
}

export const ClockDisplay = ({ bpm, beat, onTapClick, onResetClick }: ClockDisplayProps) => (
  <div className={c.wrapper}>
    <div className={c.left}>
      <div>
        <div className={c.bpm}>
          <span className={c.label}>BPM</span>
          <span className={c.number}>{bpm}</span>
        </div>
      </div>
      <div className={c.bottom}>
        <div className={c.beat}>{beat}</div>
      </div>
    </div>
    <div className={c.right}>
      <Button type="neutral" size="xsmall" className={c.tapButton} onClick={onTapClick}>
        Tap
      </Button>
      <Button type="neutral" size="xsmall" className={c.tapButton} onClick={onResetClick}>
        Reset
      </Button>
    </div>
  </div>
)
