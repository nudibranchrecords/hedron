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
  useEngineStoreWithContext,
} from '@hedron/ui-core'
import { LFOInput } from 'src/LFOInput'

interface IProps {
  input: Input
  // TODO: This can be typed as something like HedronEngineWithPlugin<MidiInput>
  engine: HedronEngine
}

const Item = ({
  nodeId,
  optionNodesConfig,
}: {
  nodeId: string
  optionNodesConfig: LFOInput['optionNodesConfig']
}) => {
  const param = useEngineStore((state) => state.nodes[nodeId])

  console.log(optionNodesConfig, param)
  const cfg = optionNodesConfig.find((opt) => opt.key === param.key)
  const title = cfg?.title ?? cfg?.key

  console.log(cfg)

  return <Param param={{ ...param, title }} />
}

/**
 * A react component that displays the lfo settings for a parameter
 */
export const LFOInputPanel = ({ engine, input }: IProps) => {
  const plugin = engine.plugins['lfo-input']
  return (
    <div>
      LFO!!
      <ControlGrid className="mb-xl">
        {/* TODO: Generic container component for nodes (see SketchParams...) */}
        {input.optionNodeIds.map((id) => (
          <Item key={id} nodeId={id} optionNodesConfig={plugin.optionNodesConfig} />
        ))}
      </ControlGrid>
    </div>
  )
}
