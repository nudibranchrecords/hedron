import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Colorful,
  ColorResult,
  hexToHsva,
  HsvaColor,
  hsvaToHex,
  rgbaToHex,
  rgbaToHsva,
} from '@uiw/react-color'
import { useFloating, shift, offset } from '@floating-ui/react-dom'
import css from './ColorPicker.module.css'

type RGBColor = [number, number, number]

export type ColorPickerHandle = {
  updateColor: (value: RGBColor) => void
}

interface ColorPickerProps {
  onValueChange: (value: RGBColor) => void
}

const defaultColor: HsvaColor = hexToHsva('#FFFFFF')

export const ColorPicker = forwardRef<ColorPickerHandle, ColorPickerProps>(function ColorPicker(
  { onValueChange },
  ref,
) {
  const colorBoxRef = useRef<HTMLDivElement>(null)
  const [color, setColor] = useState<HsvaColor>(defaultColor)
  const colorRef = useRef<HsvaColor>(defaultColor)
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
    ({ rgb: { r, g, b }, hsva }: ColorResult) => {
      setColor(hsva)
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
    const rgba = { r: r * 255, g: g * 255, b: b * 255, a: 1 }
    const hsva = rgbaToHsva(rgba)
    colorBoxRef.current?.style.setProperty('background-color', rgbaToHex(rgba))
    colorRef.current = hsva
  }, [])

  useImperativeHandle(ref, () => ({ updateColor }), [updateColor])

  const backgroundColor = useMemo(() => hsvaToHex(color), [color])

  return (
    <div className={css.container} ref={refs.setReference}>
      <div
        className={css.colorBox}
        style={{ backgroundColor }}
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
