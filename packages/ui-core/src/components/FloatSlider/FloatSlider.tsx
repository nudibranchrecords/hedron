import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts'
import css from './FloatSlider.module.css'
import { useElementScrub } from '@hooks/useElementScrub'

type Size = {
  width?: number
  height?: number
}

const barWidth = 2
const PIXEL_DENSITY = 2

export type FloatSliderHandle = {
  updateValue: (value: number) => void
}

interface FloatSliderProps {
  onValueChange: (val: number) => void
  min: number
  max: number
}

export const FloatSlider = forwardRef<FloatSliderHandle, FloatSliderProps>(function FloatSlider(
  { onValueChange, min, max },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null)
  const currVal = useRef<number>(0)
  const size = useRef({ width: 0, height: 0 })
  const numberInput = useRef<HTMLInputElement>(null!)

  const range = useMemo(() => max - min, [max, min])

  const updateTextValue = useCallback((value: number) => {
    numberInput.current.value = value.toFixed(2)
  }, [])

  const updateValue = useCallback(
    (value: number) => {
      const ctx = canvasCtx.current

      if (!ctx) return

      const w = size.current.width - barWidth
      const h = size.current.height
      const x = ((value - min) / range) * w

      const prevX = ((currVal.current - min) / range) * w

      // Only clear the area from the last position
      ctx.clearRect(prevX - 1, 0, barWidth + 2, h)

      // Draw bar
      ctx.fillStyle = '#fff'
      ctx.fillRect(x, 0, barWidth, h)

      updateTextValue(value)

      currVal.current = value
    },
    [min, range, updateTextValue],
  )

  const onInputSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const input = numberInput.current

      if (input) {
        const value = parseFloat(input.value)
        if (!isNaN(value)) {
          updateValue(value)
          onValueChange(value)
        }
      }
    },
    [updateValue, onValueChange],
  )

  const onInputBlur = useCallback(() => {
    updateTextValue(currVal.current)
  }, [updateTextValue])

  const onDoubleClick = useCallback(() => {
    numberInput.current.select()
  }, [])

  const onResize = useDebounceCallback(({ width, height }: Size) => {
    const canvas = canvasRef.current

    if (!canvas) return

    canvas.height = height! * PIXEL_DENSITY
    canvas.width = width! * PIXEL_DENSITY
    size.current.width = width! * PIXEL_DENSITY
    size.current.height = height! * PIXEL_DENSITY
    canvas.setAttribute('style', 'width:' + width + 'px; height:' + height + 'px;')
  }, 200)

  useResizeObserver({
    ref: containerRef,
    onResize,
  })

  const onElementScrub = useCallback(
    (inc: number) => {
      const diff = inc * range
      const newVal = Math.max(min, Math.min(max, currVal.current + diff))

      updateValue(newVal)
      onValueChange(newVal)
    },
    [range, min, max, updateValue, onValueChange],
  )

  useElementScrub(canvasRef, onElementScrub)

  useEffect(() => {
    const canvas = canvasRef.current!
    canvasCtx.current = canvas.getContext('2d')
  }, [])

  useImperativeHandle(ref, () => {
    return { updateValue }
  }, [updateValue])

  return (
    <div className={css.wrapper} ref={containerRef}>
      <form onSubmit={onInputSubmit} noValidate>
        <input type="number" className={css.textBox} ref={numberInput} onBlur={onInputBlur} />
      </form>
      <canvas
        ref={canvasRef}
        className={css.canvas}
        width={0}
        height={0}
        onDoubleClick={onDoubleClick}
      />
    </div>
  )
})
