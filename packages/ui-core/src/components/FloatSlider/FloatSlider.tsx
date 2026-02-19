import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts'
import css from './FloatSlider.module.css'
import { useElementScrub } from '@hooks/useElementScrub'
import { NumberInput, NumberInputHandle } from '@components/NumberInput/NumberInput'

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
  min?: number
  max?: number
}

export const FloatSlider = forwardRef<FloatSliderHandle, FloatSliderProps>(function FloatSlider(
  { onValueChange, min = 0, max = 1 },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null!)
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null)
  const currVal = useRef<number>(0)
  const size = useRef({ width: 0, height: 0 })
  const numberInput = useRef<NumberInputHandle>(null)
  const zeroPip = useRef<HTMLDivElement>(null!)

  // Always positive range, regardless of which number is larger
  // min/max is really the sliders left side and right side values, not necessarily min/max in the traditional sense
  const range = useMemo(() => Math.abs(max - min), [max, min])
  // Direction: 1 if increasing, -1 if decreasing
  const direction = useMemo(() => (max >= min ? 1 : -1), [max, min])

  const drawBar = useCallback(
    (value: number) => {
      const ctx = canvasCtx.current

      if (!ctx) return

      const w = size.current.width - barWidth
      const h = size.current.height

      let x

      // Red line if slider is out of bounds
      ctx.fillStyle = '#fe0000'

      // Normalize value for any min/max order
      const minVal = Math.min(min, max)
      const maxVal = Math.max(min, max)
      // For out-of-bounds, red bar should be at the side corresponding to the violated bound
      if (value > maxVal) {
        // Exceeds the greater value, so bar is at the side for max
        x = max > min ? w : 0
      } else if (value < minVal) {
        // Below the lesser value, so bar is at the side for min
        x = min < max ? 0 : w
      } else {
        ctx.fillStyle = '#fff'
        // Map value to [0, 1] regardless of direction
        const t = (value - min) / (max - min)
        x = t * w
      }

      // Previous value position
      const prevT = (currVal.current - min) / (max - min)
      const prevX = Math.min(Math.max(0, prevT * w), w)

      // Only clear the area from the last position
      ctx.clearRect(prevX - 1, 0, barWidth + 2, h)

      // Draw bar
      ctx.fillRect(x, 0, barWidth, h)
    },
    [min, max],
  )

  const updateValue = useCallback(
    (value: number) => {
      drawBar(value)
      numberInput.current?.updateValue(value)

      currVal.current = value
    },
    [drawBar],
  )

  const onDoubleClick = useCallback(() => {
    numberInput.current?.focus()
  }, [])

  const updateZeroPip = useCallback(() => {
    // Show zero pip if 0 is between min and max (regardless of order)
    if ((min <= 0 && max >= 0) || (max <= 0 && min >= 0)) {
      zeroPip.current.style.display = 'block'
      const w = canvasRef.current.offsetWidth - barWidth
      const zeroPos = (0 - min) / (max - min)
      zeroPip.current.style.left = `${zeroPos * w}px`
    } else {
      zeroPip.current.style.display = 'none'
    }
  }, [min, max])

  const onResize = useCallback(
    ({ width, height }: Size) => {
      const canvas = canvasRef.current

      canvas.height = height! * PIXEL_DENSITY
      canvas.width = width! * PIXEL_DENSITY
      size.current.width = width! * PIXEL_DENSITY
      size.current.height = height! * PIXEL_DENSITY
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'

      drawBar(currVal.current)
      updateZeroPip()
    },
    [drawBar, updateZeroPip],
  )

  const onResizeDebounced = useDebounceCallback(onResize, 200)

  useResizeObserver({
    ref: containerRef,
    onResize: onResizeDebounced,
  })

  const onElementScrub = useCallback(
    ({ x }: { x: number; y: number }) => {
      const diff = x * range * direction
      let newVal = currVal.current + diff
      // Clamp to min/max regardless of order
      if (direction === 1) {
        newVal = Math.max(min, Math.min(max, newVal))
      } else {
        newVal = Math.min(min, Math.max(max, newVal))
      }
      updateValue(newVal)
      onValueChange(newVal)
    },
    [range, min, max, direction, updateValue, onValueChange],
  )

  useElementScrub(canvasRef, onElementScrub, 'ew-resize')

  useEffect(() => {
    const canvas = canvasRef.current
    canvasCtx.current = canvas.getContext('2d')
    onResize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    })
  }, [onResize])

  useImperativeHandle(ref, () => {
    return { updateValue }
  }, [updateValue])

  return (
    <div className={css.wrapper} ref={containerRef}>
      <NumberInput
        onValueChange={onValueChange}
        ref={numberInput}
        className={css.numberInputContainer}
      />
      <canvas
        ref={canvasRef}
        className={css.canvas}
        width={0}
        height={0}
        onDoubleClick={onDoubleClick}
      />
      <div className={css.zeroPip} ref={zeroPip} />
    </div>
  )
})
