import { useRef } from 'react'
import { useOnParamValueChange } from '@hooks/useOnParamValueChange'
import { useSubscribeToNodeChildrenValues } from '@hooks/useSubscribeToParamValue'
import { ColorPicker, ColorPickerHandle } from '@components/ColorPicker/ColorPicker'

interface ParamRGBProps {
  id: string
}

export const ParamColor = ({ id }: ParamRGBProps) => {
  const ref = useRef<ColorPickerHandle>(null)
  const onValueChange = useOnParamValueChange(id)

  useSubscribeToNodeChildrenValues<number>(id, (value) => {
    ref.current?.updateColor(value as [number, number, number])
  })

  return <ColorPicker ref={ref} onValueChange={onValueChange} />
}
