import { useEffect, useState } from 'react'
import { ClockDisplay } from '@components/core/ClockDisplay/ClockDisplay'
import { clock } from '@renderer/engine'

export const GlobalClock = () => {
  const [bpm, setBpm] = useState<number>(0)
  const [beat, setBeat] = useState<number>(1)
  const [isRunning, setIsRunning] = useState<boolean>(false)

  useEffect(() => {
    const unregisterBeats = clock.onNewBeat(setBeat)
    const unregisterBpm = clock.onBpmChange(setBpm)
    const unregisterIsRunning = clock.onIsRunningChange(setIsRunning)

    return () => {
      unregisterBeats()
      unregisterBpm()
      unregisterIsRunning()
    }
  }, [])

  return (
    <ClockDisplay
      isRunning={isRunning}
      bpm={bpm}
      beat={beat}
      onStartClick={clock.start}
      onStopClick={clock.stop}
      onTapClick={clock.sendTempoTap}
      onResetClick={clock.reset}
    />
  )
}
