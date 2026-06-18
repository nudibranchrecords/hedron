import { Param as ParamType, Shot as ShotType } from '@hedron-gl/engine'
import { ParamNumber } from './ParamNumber/ParamNumber'
import { ParamBoolean } from './ParamBoolean/ParamBoolean'
import { ParamEnum } from './ParamEnum/ParamEnum'
import { ParamFile } from './ParamFile/ParamFile'
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
import { useEngineStore, useAppStore } from '@hooks/engineHooks'
import { useInputCount } from '@hooks/useInputCount'
import { useOnSelectNode } from '@hooks/useOnSelectNode'

const getInputElement = (node: ParamType | ShotType) => {
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
    case 'file':
      return <ParamFile id={node.id} />
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

export const NodeContainer = ({ nodeId }: { nodeId: string }) => {
  const node = useEngineStore((state) => state.nodes[nodeId])
  const inputCount = useInputCount(nodeId)
  const activeSketchId = useAppStore((state) => state.activeSketchId)
  const isActive = useAppStore((state) =>
    activeSketchId ? state.selectedNodes[activeSketchId] === nodeId : false,
  )
  const onSelectNode = useOnSelectNode(activeSketchId, nodeId)

  if (!node) {
    return <i>Node with id {nodeId} not found</i>
  }

  if (node.nodeType === 'custom') {
    return "NodeContainer: Tried to render a custom node, this isn't supported. Node ID: " + node.id
  }

  if (node.nodeType === 'input') {
    return "NodeContainer: Tried to render an input node, this isn't supported. Node ID: " + node.id
  }

  return (
    <NodeControl key={node.key} onClick={onSelectNode} isActive={isActive}>
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
