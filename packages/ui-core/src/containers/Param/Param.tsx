import { NodeTypes, Param as ParamType } from '@hedron/engine'
import { ParamNumber } from './ParamNumber/ParamNumber'
import { ParamBoolean } from './ParamBoolean/ParamBoolean'
import { ParamEnum } from './ParamEnum/ParamEnum'
import { ParamVector3 } from './ParamVector3/ParamVector3'
import { ParamColor } from './ParamColor/ParamColor'
import { ParamString } from './ParamString/ParamString'
import { useOnSelectNode } from '@hooks/useOnSelectNode'
import { useAppStore } from '@hooks/store'
import {
  NodeControl,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
} from '@components/NodeControl/NodeControl'

const getInputElement = (valueType: NodeTypes, id: string) => {
  switch (valueType) {
    case NodeTypes.Number:
      return <ParamNumber id={id} />
    case NodeTypes.Boolean:
      return <ParamBoolean id={id} />
    case NodeTypes.String:
      return <ParamString id={id} />
    case NodeTypes.Enum:
      return <ParamEnum id={id} />
    case NodeTypes.Vector3:
      return <ParamVector3 id={id} />
    case NodeTypes.RGB:
      return <ParamColor id={id} />
    default:
      return <i>Unsupported type {valueType}</i>
  }
}

export const Param = ({ param: { key, title, id, sketchId, valueType } }: ParamType) => {
  const onSelectNode = useOnSelectNode(sketchId, id)
  const selected = useAppStore((state) => state.selectedNodes[sketchId])
  return (
    <NodeControl key={key} onClick={onSelectNode} isActive={id === selected}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>{getInputElement(valueType, id)}</NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}
