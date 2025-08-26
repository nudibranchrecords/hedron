import { HedronEngine, Input } from '@hedron/engine'
import {
  ControlGrid,
  NodeControl,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
} from '@hedron/ui-core'

interface IProps {
  input: Input
  // TODO: This can be typed as something like HedronEngineWithPlugin<MidiInput>
  engine: HedronEngine
}

/**
 * A react component that displays the lfo settings for a parameter
 */
export const LFOInputPanel = ({ input, engine }: IProps) => {
  return (
    <div>
      LFO!!
      <ControlGrid className="mb-xl">
        {/* TODO: Generic container component for nodes (see SketchParams...) */}
        {input.optionNodeIds.map((id) => (
          <NodeControl key={id}>
            <NodeControlMain>
              <NodeControlTitle>{id}</NodeControlTitle>
              <NodeControlInner>TODO!</NodeControlInner>
            </NodeControlMain>
          </NodeControl>
        ))}
      </ControlGrid>
    </div>
  )
}
