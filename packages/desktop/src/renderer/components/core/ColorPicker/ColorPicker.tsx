import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Colorful, ColorResult } from '@uiw/react-color'
import css from './ColorPicker.module.css'

type RGBColor = [number, number, number]

export type ColorChangeHandle = {
  updateColor: (value: RGBColor) => void
}

interface ColorPickerProps {
  onValueChange: (value: RGBColor) => void
}

export const ColorPicker = forwardRef<ColorChangeHandle, ColorPickerProps>(function ColorPicker(
  { onValueChange },
  ref,
) {
  const colorBoxRef = useRef<HTMLDivElement>(null)
  const [color, setColor] = useState('#ffffff')
  const [isOpen, setIsOpen] = useState(false)

  const onBoxClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen((isOpen) => !isOpen)
  }, [])

  const onPickerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  const onChange = useCallback(
    (color: ColorResult) => {
      setColor(color.hex)
      onValueChange([color.rgb.r, color.rgb.g, color.rgb.b])
    },
    [onValueChange],
  )

  const updateColor = useCallback((rgb: RGBColor) => {
    const values = rgb.map((v) => v * 255).join(',')
    colorBoxRef.current?.style.setProperty('background-color', `rgb(${values})`)
  }, [])

  useEffect(() => {
    const handleClick = () => {
      setIsOpen(false)
    }
    document.body.addEventListener('click', handleClick)
    return () => {
      document.body.removeEventListener('click', handleClick)
    }
  }, [])

  useImperativeHandle(ref, () => {
    return { updateColor }
  }, [updateColor])

  return (
    <div className={css.container}>
      <div
        className={css.colorBox}
        style={{ backgroundColor: color }}
        onClick={onBoxClick}
        ref={colorBoxRef}
      />
      {isOpen && (
        <div className={css.picker} onClick={onPickerClick}>
          <Colorful color={color} onChange={onChange} disableAlpha />
        </div>
      )}
    </div>
  )
})
