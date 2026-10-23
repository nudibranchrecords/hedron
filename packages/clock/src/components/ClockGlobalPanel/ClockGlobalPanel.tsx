import { NodeContainer, useNodeOptionNodes } from '@hedron-gl/ui-core'
import { ClockOptionNodes } from '@/ClockPlugin'
import { CLOCK_NODE_ID } from '@/constants'

export function ClockGlobalPanel(): JSX.Element {
  const optionNodes = useNodeOptionNodes<ClockOptionNodes>(CLOCK_NODE_ID)
  const bpmNode = optionNodes['bpmValue']!

  return <NodeContainer nodeId={bpmNode.id} />
}
