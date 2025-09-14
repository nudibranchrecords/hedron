import { NodeValueType } from '@hedron/engine'
import { useCallback } from 'react'
import { ParamNumber } from './ParamNumber/ParamNumber'
import { ParamBoolean } from './ParamBoolean/ParamBoolean'
import { ParamEnum } from './ParamEnum/ParamEnum'
import { ParamVector3 } from './ParamVector3/ParamVector3'
import { ParamColor } from './ParamColor/ParamColor'
import { ParamString } from './ParamString/ParamString'

import {
  NodeControl,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
} from '@components/NodeControl/NodeControl'
import { useEngineStore } from '@hooks/storeHooks'

const getInputElement = (valueType: NodeValueType, id: string) => {
  switch (valueType) {
    case 'number':
      return <ParamNumber id={id} />
    case 'boolean':
      return <ParamBoolean id={id} />
    case 'string':
      return <ParamString id={id} />
    case 'enum':
      return <ParamEnum id={id} />
    case 'vector3':
      return <ParamVector3 id={id} />
    case 'rgb':
      return <ParamColor id={id} />
    default:
      return <i>Unsupported type {valueType}</i>
  }
}

export const Param = ({
  onClick,
  isActive,
  paramId,
}: {
  onClick?: (nodeId: string) => void
  isActive?: boolean
  paramId: string
}) => {
  const { key, title, id, valueType } = useEngineStore((state) => state.nodes[paramId])

  const _onClick = useCallback(() => {
    onClick?.(paramId)
  }, [paramId, onClick])
  return (
    <NodeControl key={key} onClick={_onClick} isActive={isActive}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>{getInputElement(valueType, id)}</NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const NodeParam = Param
