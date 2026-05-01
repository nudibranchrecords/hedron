import { ParamRGB } from '@hedron-gl/engine'
import { useRef } from 'react'
import { useSubscribeToNodeChildrenValues } from '@hooks/useSubscribeToParamValue'
import { useEngineStore } from '@hooks/engineHooks'
import { ColorPicker, ColorPickerHandle } from '@components/ColorPicker/ColorPicker'
import { useOnParamVec3ValueChange } from '@hooks/useOnParamVec3ValueChange'

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

  const onVec3ValueChange = useOnParamVec3ValueChange(
    vectorComponentIds[0],
    vectorComponentIds[1],
    vectorComponentIds[2],
  )

  return <ColorPicker ref={ref} onValueChange={onVec3ValueChange} />
}
