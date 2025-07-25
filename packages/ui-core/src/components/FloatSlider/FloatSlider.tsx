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

  useEffect(() => {
    console.log('mt')
  }, [])

  const range = useMemo(() => max - min, [max, min])

  const drawBar = useCallback(
    (value: number) => {
      const ctx = canvasCtx.current

      if (!ctx) return

      const w = size.current.width - barWidth
      const h = size.current.height

      let x

      // Red line if slider is out of bounds
      ctx.fillStyle = '#fe0000'

      if (value > max) {
        x = w
      } else if (value < min) {
        x = 0
      } else {
        ctx.fillStyle = '#fff'
        x = ((value - min) / range) * w
      }

      const prevX = Math.min(Math.max(0, ((currVal.current - min) / range) * w), w)

      // Only clear the area from the last position
      ctx.clearRect(prevX - 1, 0, barWidth + 2, h)

      // Draw bar
      ctx.fillRect(x, 0, barWidth, h)
    },
    [min, max, range],
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
    if (min >= 0) {
      zeroPip.current.style.display = 'none'
    } else {
      zeroPip.current.style.display = 'block'
      const w = canvasRef.current.offsetWidth - barWidth
      const zeroPos = (0 - min) / range
      zeroPip.current.style.left = `${zeroPos * w}px`
    }
  }, [min, range])

  const onResize = useCallback(
    ({ width, height }: Size) => {
      const canvas = canvasRef.current

      canvas.height = height! * PIXEL_DENSITY
      canvas.width = width! * PIXEL_DENSITY
      size.current.width = width! * PIXEL_DENSITY
      size.current.height = height! * PIXEL_DENSITY
      canvas.setAttribute('style', 'width:' + width + 'px; height:' + height + 'px;')

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
