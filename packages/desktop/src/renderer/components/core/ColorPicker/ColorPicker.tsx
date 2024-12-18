import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Colorful, ColorResult } from '@uiw/react-color'
import { useFloating, shift, offset } from '@floating-ui/react-dom'
import css from './ColorPicker.module.css'

type RGBColor = [number, number, number]

export type ColorPickerHandle = {
  updateColor: (value: RGBColor) => void
}

interface ColorPickerProps {
  onValueChange: (value: RGBColor) => void
}

export const ColorPicker = forwardRef<ColorPickerHandle, ColorPickerProps>(function ColorPicker(
  { onValueChange },
  ref,
) {
  const colorBoxRef = useRef<HTMLDivElement>(null)
  const [color, setColor] = useState('#ffffff')
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles } = useFloating({
    middleware: [shift({ padding: 10 }), offset({ mainAxis: 10 })],
  })

  const onBoxClick = useCallback(() => {
    setIsOpen((isOpen) => !isOpen)
  }, [])

  const onPickerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  const onChange = useCallback(
    (color: ColorResult) => {
      setColor(color.hex)
      onValueChange([color.rgb.r / 255, color.rgb.g / 255, color.rgb.b / 255])
    },
    [onValueChange],
  )

  const updateColor = useCallback((rgb: RGBColor) => {
    const values = rgb.map((v) => v * 255).join(',')
    colorBoxRef.current?.style.setProperty('background-color', `rgb(${values})`)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // do not close the picker if the color box is clicked
      if (colorBoxRef.current?.contains(e.target as Node)) return
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
    <div className={css.container} ref={refs.setReference}>
      <div
        className={css.colorBox}
        style={{ backgroundColor: color }}
        onClick={onBoxClick}
        ref={colorBoxRef}
      />
      {isOpen && (
        <div
          className={css.picker}
          ref={refs.setFloating}
          style={{ ...floatingStyles }}
          onClick={onPickerClick}
        >
          <Colorful color={color} onChange={onChange} disableAlpha />
        </div>
      )}
    </div>
  )
})
