import { ParamRGB } from '@hedron-gl/engine'
import { useRef } from 'react'
import { useSubscribeToNodeChildrenValues } from '@hooks/useSubscribeToNodeValue'
import { useEngineStore } from '@hooks/storeHooks'
import { ColorPicker, ColorPickerHandle } from '@components/ColorPicker/ColorPicker'
import { useOnNodeVec3ValueChange } from '@hooks/useOnNodeVec3ValueChange'

interface ParamRGBProps {
  id: string
}

export const ParamColor = ({ id }: ParamRGBProps) => {
  const ref = useRef<ColorPickerHandle>(null)
  const node = useEngineStore((state) => state.nodes[id] as ParamRGB)
  const { vectorComponentIds } = node.childGroups

  useSubscribeToNodeChildrenValues<number>(id, (value) => {
    ref.current?.updateColor(value as [number, number, number])
  })

  const onVec3ValueChange = useOnNodeVec3ValueChange(
    vectorComponentIds[0],
    vectorComponentIds[1],
    vectorComponentIds[2],
  )

  return <ColorPicker ref={ref} onValueChange={onVec3ValueChange} />
}
