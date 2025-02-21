import c from './ClockDisplay.module.css'
import { Button } from '@components/core/Button/Button'

export interface ClockDisplayProps {
  bpm: number
  beat: number
  isRunning: boolean
  onStartClick: () => void
  onStopClick: () => void
  onTapClick: () => void
  onResetClick: () => void
}

export const ClockDisplay = ({
  bpm,
  beat,
  isRunning,
  onStartClick,
  onStopClick,
  onTapClick,
  onResetClick,
}: ClockDisplayProps) => (
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
      <Button
        type="neutral"
        size="xsmall"
        className={c.button}
        onClick={onStartClick}
        disabled={isRunning}
      >
        Start
      </Button>
      <Button
        type="neutral"
        size="xsmall"
        className={c.button}
        onClick={onStopClick}
        disabled={!isRunning}
      >
        Stop
      </Button>
      <Button type="neutral" size="xsmall" className={c.button} onClick={onTapClick}>
        Tap
      </Button>
      <Button type="neutral" size="xsmall" className={c.button} onClick={onResetClick}>
        Reset
      </Button>
    </div>
  </div>
)
