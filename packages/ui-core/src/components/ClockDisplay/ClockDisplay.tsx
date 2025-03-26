import c from './ClockDisplay.module.css'
import { IconName } from '@components/core/Icon/Icon'
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
  const playPauseButton = {
    iconName: isRunning ? 'pause' : 'play_arrow',
    onClick: isRunning ? onStopClick : onStartClick,
  }

  return (
    <div className={c.wrapper}>
      <div className={c.info}>
        <div className={c.bpm}>
          <span className={c.label}>BPM</span>
          <input
            type="number"
            className={c.number}
            value={bpm}
            onChange={(e) => onBpmEdit(Number(e.target.value))}
          />
        </div>
        <div className={c.beat}>{beat}</div>
      </div>
      <div className={c.controls}>
        <Button
          type="neutral"
          iconName={playPauseButton.iconName as IconName}
          className={c.iconButton}
          onClick={playPauseButton.onClick}
        />

        <Button type="neutral" className={c.button} onClick={onResetClick}>
          Reset
        </Button>

        <Button type="neutral" className={c.button} onClick={onTapClick}>
          Tap
        </Button>
      </div>
    </div>
  )
}
