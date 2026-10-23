import { ControlGrid, NodeContainer, useNodeOptionNodes } from '@hedron-gl/ui-core'
import { ClockOptionNodes } from '@/ClockPlugin'
import { CLOCK_NODE_ID } from '@/constants'

export function ClockGlobalPanel(): JSX.Element {
  const { globalClockBpm, togglePlay, reset, tapTempo } =
    useNodeOptionNodes<ClockOptionNodes>(CLOCK_NODE_ID)

  return (
    <>
      {globalClockBpm && <NodeContainer nodeId={globalClockBpm.id} />}
      <ControlGrid>
        {togglePlay && <NodeContainer nodeId={togglePlay.id} />}
        {reset && <NodeContainer nodeId={reset.id} />}
        {tapTempo && <NodeContainer nodeId={tapTempo.id} />}
      </ControlGrid>
    </>
  )
}
