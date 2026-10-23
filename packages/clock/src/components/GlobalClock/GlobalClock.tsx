import { useSyncExternalStore } from 'react'
import { useEngine } from '@hedron-gl/ui-core'
import { ClockDisplay } from '@/components/ClockDisplay/ClockDisplay'
import { ClockPlugin } from '@/ClockPlugin'
import { isValidBpm } from '@/Clock'
import { CLOCK_NODE_ID, CLOCK_PLUGIN_ID } from '@/constants'

export const GlobalClock = () => {
  const engine = useEngine()
  const clockPlugin = engine.getPlugin<ClockPlugin>(CLOCK_PLUGIN_ID)
  if (!clockPlugin) {
    throw new Error('Clock plugin is not registered')
  }
  const { clock } = clockPlugin

  const bpm = useSyncExternalStore(clock.onSmoothedBpmChange, () => clock.smoothedBpm)
  const beat = useSyncExternalStore(clock.onNewBeat, () => clock.beatCount)
  const isRunning = useSyncExternalStore(clock.onIsRunningChange, () => clock.isRunning)

  const onBpmEdit = (newBpm: number) => {
    if (!isValidBpm(newBpm)) return
    const bpmNode = engine.getNodeOptionNode(CLOCK_NODE_ID, 'bpmValue')
    engine.setParamValue(bpmNode.id, newBpm)
  }

  return (
    <ClockDisplay
      isRunning={isRunning}
      bpm={bpm}
      beat={beat}
      onBpmEdit={onBpmEdit}
      onStartClick={clock.start}
      onStopClick={clock.stop}
      onTapClick={clock.sendTempoTap}
      onResetClick={clock.reset}
    />
  )
}
