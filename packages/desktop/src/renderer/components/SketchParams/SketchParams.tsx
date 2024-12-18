import { NodeTypes } from '@hedron/engine'
import { useOnSelectNode } from '@components/hooks/useOnSelectNode'
import { ParamWithInfo, useActiveSketchParams } from '@components/hooks/useActiveSketchParams'
import { ParamNumber } from '@components/ParamNumber/ParamNumber'
import { ParamBoolean } from '@components/ParamBoolean/ParamBoolean'
import { ParamEnum } from '@components/ParamEnum/ParamEnum'
import { ParamVector3 } from '@components/ParamVector3/ParamVector3'
import { ParamRGB } from '@components/ParamRGB/ParamRGB'
import {
  NodeControl,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
} from '@components/core/NodeControl/NodeControl'
import { ControlGrid } from '@components/core/ControlGrid/ControlGrid'
import { useAppStore } from '@renderer/appStore'

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
    case NodeTypes.Vector3:
      return <ParamVector3 id={id} />
    case NodeTypes.RGB:
      return <ParamRGB id={id} />
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
