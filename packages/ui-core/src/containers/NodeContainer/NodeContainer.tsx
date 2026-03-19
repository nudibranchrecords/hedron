import { Input, Node } from '@hedron-gl/engine'
import { useCallback } from 'react'
import { ParamNumber } from './ParamNumber/ParamNumber'
import { ParamBoolean } from './ParamBoolean/ParamBoolean'
import { ParamEnum } from './ParamEnum/ParamEnum'
import { ParamVector3 } from './ParamVector3/ParamVector3'
import { ParamColor } from './ParamColor/ParamColor'
import { ParamString } from './ParamString/ParamString'
import { Shot } from './Shot/Shot'

import { ParamVector2 } from './ParamVector2/ParamVector2'
import {
  NodeControl,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
  NodeControlInfo,
  NodeControlInputCount,
} from '@components/NodeControl/NodeControl'
import { useEngineStore } from '@hooks/storeHooks'
import { useInputCount } from '@hooks/useInputCount'

const getInputElement = (node: Exclude<Node, Input>) => {
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
    case 'vector2':
      return <ParamVector2 id={node.id} />
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
  const inputCount = useInputCount(nodeId)

  const _onClick = useCallback(() => {
    onClick?.(nodeId)
  }, [nodeId, onClick])

  if (!node) {
    return <i>Node with id {nodeId} not found</i>
  }

  if (node.nodeType === 'input') {
    return "NodeContainer: Tried to render an input node, this isn't supported. Node ID: " + node.id
  }

  return (
    <NodeControl key={node.key} onClick={_onClick} isActive={isActive}>
      <NodeControlMain>
        <NodeControlInfo>
          <NodeControlTitle>{node.title}</NodeControlTitle>
          <NodeControlInputCount inputCount={inputCount} />
        </NodeControlInfo>
        <NodeControlInner>{getInputElement(node)}</NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const NodeParam = NodeContainer
