import { ControlGrid } from '../core/ControlGrid/ControlGrid'
import {
  NodeControl,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
} from '../core/NodeControl/NodeControl'
import { ParamWithInfo, useActiveSketchParams } from '../hooks/useActiveSketchParams'

import { NodeTypes } from 'src/engine/store/types'
import { ParamNumber } from '../ParamNumber/ParamNumber'
import { ParamBoolean } from '../ParamBoolean/ParamBoolean'

interface ParamProps {
  param: ParamWithInfo
}

const getInputElement = (valueType: NodeTypes, id: string) => {
  switch (valueType) {
    case NodeTypes.Number:
      return <ParamNumber id={id} />
    case NodeTypes.Boolean:
      return <ParamBoolean id={id} />
    default:
      return <i>`Unsupported type ${valueType}`</i>
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
