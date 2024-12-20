import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Colorful, ColorResult, rgbaToHex } from '@uiw/react-color'
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
  const colorRef = useRef('#ffffff')
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles } = useFloating({
    middleware: [shift({ padding: 10 }), offset({ mainAxis: 10 })],
  })

  const onBoxClick = useCallback(() => {
    setColor(colorRef.current)
    setIsOpen((isOpen) => !isOpen)
  }, [])

  const onPickerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  const onChange = useCallback(
    ({ rgb: { r, g, b }, hex }: ColorResult) => {
      setColor(hex)
      onValueChange([r / 255, g / 255, b / 255])
    },
    [onValueChange],
  )

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

  // Avoiding using state to keep external frequent updates performant
  const updateColor = useCallback(([r, g, b]: RGBColor) => {
    const hex = rgbaToHex({ r: r * 255, g: g * 255, b: b * 255, a: 1 })
    colorBoxRef.current?.style.setProperty('background-color', hex)
    colorRef.current = hex
  }, [])

  useImperativeHandle(ref, () => ({ updateColor }), [updateColor])

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
          className={css.pickerContainer}
          ref={refs.setFloating}
          style={{ ...floatingStyles }}
          onClick={onPickerClick}
        >
          <Colorful className={css.picker} color={color} onChange={onChange} disableAlpha />
        </div>
      )}
    </div>
  )
})
