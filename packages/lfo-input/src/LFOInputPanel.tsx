import { HedronEngine, Input } from '@hedron/engine'
import {
  ControlGrid,
  NodeControl,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
  Param,
  useAppStore,
  useEngineStore,
} from '@hedron/ui-core'

interface IProps {
  input: Input
  // TODO: This can be typed as something like HedronEngineWithPlugin<MidiInput>
  engine: HedronEngine
}

const Item = ({ nodeId }: { nodeId: string }) => {
  const param = useEngineStore((state) => state.nodes[nodeId])

  return <Param param={param} />
}

/**
 * A react component that displays the lfo settings for a parameter
 */
export const LFOInputPanel = ({ input }: IProps) => {
  return (
    <div>
      LFO!!
      <ControlGrid className="mb-xl">
        {/* TODO: Generic container component for nodes (see SketchParams...) */}
        {input.optionNodeIds.map((id) => (
          <Item key={id} nodeId={id} />
        ))}
      </ControlGrid>
    </div>
  )
}
