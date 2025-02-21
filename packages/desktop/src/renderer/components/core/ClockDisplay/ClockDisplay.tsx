import c from './ClockDisplay.module.css'
import { Button } from '@components/core/Button/Button'

export interface ClockDisplayProps {
  bpm: number
  beat: number
  isRunning: boolean
  onBpmEdit: (bpm: number) => void
  onStartClick: () => void
  onStopClick: () => void
  onTapClick: () => void
  onResetClick: () => void
}

export const ClockDisplay = ({
  bpm,
  beat,
  isRunning,
  onBpmEdit,
  onStartClick,
  onStopClick,
  onTapClick,
  onResetClick,
}: ClockDisplayProps) => {
  return (
    <div className={c.wrapper}>
      <div className={c.left}>
        <div>
          <div className={c.bpm}>
            <span className={c.label}>BPM</span>
            <span
              className={c.number}
              contentEditable
              onBlur={(e) => onBpmEdit(Number(e.currentTarget.textContent))}
            >
              {bpm}
            </span>
          </div>
        </div>
        <div className={c.bottom}>
          <Button type="ghost" iconName="edit" className={c.editButton} />
          <div className={c.beat}>{beat}</div>
        </div>
      </div>
      <div className={c.right}>
        <Button
          type="neutral"
          iconName="play_arrow"
          className={c.button}
          onClick={onStartClick}
          disabled={isRunning}
        />
        <Button
          type="neutral"
          iconName="stop"
          className={c.button}
          onClick={onStopClick}
          disabled={!isRunning}
        />
        <Button type="neutral" className={c.button} onClick={onTapClick}>
          Tap
        </Button>
        <Button type="neutral" className={c.button} onClick={onResetClick}>
          Reset
        </Button>
      </div>
    </div>
  )
}
