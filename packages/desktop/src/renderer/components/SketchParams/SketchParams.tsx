import { NodeTypes, ParamWithInfo } from '@hedron/engine'
import {
  NodeControl,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
  ControlGrid,
} from '@hedron/ui-core'
import { useOnSelectNode } from '@components/hooks/useOnSelectNode'
import { useActiveSketchParams } from '@components/hooks/useActiveSketchParams'
import { ParamNumber } from '@components/ParamNumber/ParamNumber'
import { ParamBoolean } from '@components/ParamBoolean/ParamBoolean'
import { ParamEnum } from '@components/ParamEnum/ParamEnum'
import { ParamVector3 } from '@components/ParamVector3/ParamVector3'
import { ParamColor } from '@components/ParamColor/ParamColor'

import { useAppStore } from '@renderer/appStore'
import { ParamString } from '@components/ParamString/ParamString'

interface ParamProps {
  param: ParamWithInfo
}

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

const ParamItem = ({ param: { key, title, id, sketchId, valueType } }: ParamProps) => {
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

export const SketchParams = () => {
  const params = useActiveSketchParams()

  return (
    <ControlGrid>
      {params.map((param) => (
        <ParamItem key={param.key} param={param} />
      ))}
    </ControlGrid>
  )
}
