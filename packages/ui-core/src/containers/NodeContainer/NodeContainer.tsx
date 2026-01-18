import { type Node as NodeType } from '@hedron/engine'
import { useCallback } from 'react'
import { ParamNumber } from './ParamNumber/ParamNumber'
import { ParamBoolean } from './ParamBoolean/ParamBoolean'
import { ParamEnum } from './ParamEnum/ParamEnum'
import { ParamVector3 } from './ParamVector3/ParamVector3'
import { ParamColor } from './ParamColor/ParamColor'
import { ParamString } from './ParamString/ParamString'
import { Shot } from './Shot/Shot'

import {
  NodeControl,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
} from '@components/NodeControl/NodeControl'
import { useEngineStore } from '@hooks/storeHooks'

const getInputElement = (node: NodeType) => {
  if (node.nodeType === 'shot') {
    return <Shot id={node.id} />
  }

  switch (node.valueType) {
    case 'number':
      return <ParamNumber id={node.id} />
    case 'boolean':
      return <ParamBoolean id={node.id} />
    case 'string':
      return <ParamString id={node.id} />
    case 'enum':
      return <ParamEnum id={node.id} />
    case 'vector3':
      return <ParamVector3 id={node.id} />
    case 'rgb':
      return <ParamColor id={node.id} />
    default:
      return <i>Unsupported type {(node as { valueType: string }).valueType}</i>
  }
}

export const NodeContainer = ({
  onClick,
  isActive,
  nodeId,
}: {
  onClick?: (nodeId: string) => void
  isActive?: boolean
  nodeId: string
}) => {
  const node = useEngineStore((state) => state.nodes[nodeId])

  const _onClick = useCallback(() => {
    onClick?.(nodeId)
  }, [nodeId, onClick])
  return (
    <NodeControl key={node.key} onClick={_onClick} isActive={isActive}>
      <NodeControlMain>
        <NodeControlTitle>{node.title}</NodeControlTitle>
        <NodeControlInner>{getInputElement(node)}</NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const NodeParam = NodeContainer
