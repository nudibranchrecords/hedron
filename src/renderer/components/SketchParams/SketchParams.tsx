import { ParamWithInfo, useActiveSketchParams } from '@components/hooks/useActiveSketchParams'

import { ParamNumber } from '@components/ParamNumber/ParamNumber'
import { ParamBoolean } from '@components/ParamBoolean/ParamBoolean'
import { ParamEnum } from '@components/ParamEnum/ParamEnum'
import { NodeTypes } from '@engine/store/types'
import {
  NodeControl,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
} from '@components/core/NodeControl/NodeControl'
import { ControlGrid } from '@components/core/ControlGrid/ControlGrid'

interface ParamProps {
  param: ParamWithInfo
}

const getInputElement = (valueType: NodeTypes, id: string) => {
  switch (valueType) {
    case NodeTypes.Number:
      return <ParamNumber id={id} />
    case NodeTypes.Boolean:
      return <ParamBoolean id={id} />
    case NodeTypes.Enum:
      return <ParamEnum id={id} />
    default:
      return <i>Unsupported type {valueType}</i>
  }
}

const ParamItem = ({ param: { key, title, id, valueType } }: ParamProps) => {
  return (
    <NodeControl key={key}>
      <NodeControlMain>
        <NodeControlTitle>{title ?? key}</NodeControlTitle>
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
