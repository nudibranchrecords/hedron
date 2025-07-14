import { NodeParamRGB } from '@hedron/engine'
import { useRef } from 'react'
import { ColorPicker } from '@hedron/ui-core'
import type { ColorPickerHandle } from '@hedron/ui-core'
import { useOnNodeVec3ValueChange } from '@components/hooks/useOnNodeVec3ValueChange'
import { useEngineStore } from '@renderer/engine'
import { useSubscribeToNodeChildrenValues } from '@components/hooks/useSubscribeToNodeValue'

interface ParamRGBProps {
  id: string
}

export const ParamColor = ({ id }: ParamRGBProps) => {
  const ref = useRef<ColorPickerHandle>(null)
  const node = useEngineStore((state) => state.nodes[id] as NodeParamRGB)
  const { childNodeIds } = node

  useSubscribeToNodeChildrenValues<number>(id, (value) => {
    ref.current?.updateColor(value as [number, number, number])
  })

  const onVec3ValueChange = useOnNodeVec3ValueChange(
    childNodeIds[0],
    childNodeIds[1],
    childNodeIds[2],
  )

  return <ColorPicker ref={ref} onValueChange={onVec3ValueChange} />
}
