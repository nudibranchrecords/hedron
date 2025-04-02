import type { Meta } from '@storybook/react'
import { useRef } from 'react'
import { ColorPicker, ColorPickerHandle } from '@components/ColorPicker/ColorPicker'

const meta = {
  title: 'ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ColorPicker>

export default meta

export const Default = () => {
  const colorPickerRef = useRef<ColorPickerHandle>(null)

  const handleColorChange = (value: [number, number, number]) => {
    console.log('Selected Color:', value)
  }

  return (
    <div style={{ width: '100px', height: '30px' }}>
      <ColorPicker ref={colorPickerRef} onValueChange={handleColorChange} />
    </div>
  )
}
