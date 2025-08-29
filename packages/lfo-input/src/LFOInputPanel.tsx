import { HedronEngine, Input } from '@hedron/engine'
import {
  ControlGrid,
  Param,
  useEngineStore,
  useOnSelectNode,
  useSelectedNode,
} from '@hedron/ui-core'

interface IProps {
  input: Input
  // TODO: This can be typed as something like HedronEngineWithPlugin<MidiInput>
  engine: HedronEngine
}

const Item = ({ nodeId, input }: { nodeId: string; input: Input }) => {
  const param = useEngineStore((state) => state.nodes[nodeId])
  const selectedParamId = useSelectedNode(param.id)

  const onSelectNode = useOnSelectNode(input.sketchId, param.id)

  return (
    <Param onClick={onSelectNode} param={{ ...param }} isActive={selectedParamId === param.id} />
  )
}

/**
 * A react component that displays the lfo settings for a parameter
 */
export const LFOInputPanel = ({ input }: IProps) => {
  return (
    <div>
      <ControlGrid className="mb-xl">
        {input.optionNodeIds.map((id) => (
          <Item key={id} nodeId={id} input={input} />
        ))}
      </ControlGrid>
    </div>
  )
}
