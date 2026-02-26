import { HedronEngine, Input } from '@hedron-gl/engine'
import { ControlGrid, NodeContainer } from '@hedron-gl/ui-core'

interface IProps {
  input: Input
  // TODO: This can be typed as something like HedronEngineWithPlugin<MidiInput>
  engine: HedronEngine
}

/**
 * A react component that displays the lfo settings for a parameter
 */
export const LFOInputPanel = ({ input }: IProps) => {
  return (
    <div>
      <ControlGrid className="mb-xl">
        {input.optionNodeIds.map((id) => (
          <NodeContainer key={id} nodeId={id} />
        ))}
      </ControlGrid>
    </div>
  )
}
