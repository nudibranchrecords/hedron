import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
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
}

export const FloatSlider = forwardRef<FloatSliderHandle, FloatSliderProps>(function FloatSlider(
  { onValueChange },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null)
  const currVal = useRef<number>(0)
  const size = useRef({ width: 0, height: 0 })
  const textBox = useRef<HTMLSpanElement>(null)

  const updateValue = useCallback((value: number) => {
    const ctx = canvasCtx.current

    if (!ctx) return

    const w = size.current.width - barWidth
    const h = size.current.height
    const x = value * w
    const prevX = currVal.current * w

    // Only clear the area from the last position
    ctx.clearRect(prevX - 1, 0, barWidth + 2, h)

    // Draw bar
    ctx.fillStyle = '#fff'
    ctx.fillRect(x, 0, barWidth, h)

    // Update text box
    if (textBox.current) {
      textBox.current.textContent = value.toFixed(2)
    }

    currVal.current = value
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
    (diff: number) => {
      const newVal = Math.max(0, Math.min(1, currVal.current + diff))

      updateValue(newVal)
      onValueChange(newVal)
    },
    [updateValue, onValueChange],
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
      <span className={css.textBox} ref={textBox}></span>
      <canvas ref={canvasRef} className={css.canvas} width={0} height={0} />
    </div>
  )
})
