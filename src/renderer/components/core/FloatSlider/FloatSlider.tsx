import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import c from './FloatSlider.module.css'
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts'

type Size = {
  width?: number
  height?: number
}

const barWidth = 2

export type FloatSliderHandle = {
  drawBar: (value: number) => void
}

export const FloatSlider = forwardRef<FloatSliderHandle>(function FloatSlider(_, ref) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null)
  const prevVal = useRef<number>(0)

  const drawBar = useCallback((value: number) => {
    const ctx = canvasCtx.current

    const canvas = canvasRef.current!
    if (value > 1 || value < 0) {
      throw new Error(`drawBar value must be within range 0-1. Value was ${value}`)
    }
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const x = value * w
    const prevX = prevVal.current * w

    // Only clear the area from the last position
    ctx.clearRect(prevX - 1, 0, barWidth + 2, h)

    // Draw bar
    ctx.fillStyle = '#fff'
    ctx.fillRect(x, 0, barWidth, h)

    prevVal.current = value
  }, [])

  const onResize = useDebounceCallback(({ width, height }: Size) => {
    const canvas = canvasRef.current!
    canvas.height = height!
    canvas.width = width!
  }, 200)

  useResizeObserver({
    ref: containerRef,
    onResize,
  })

  useEffect(() => {
    const canvas = canvasRef.current!
    canvasCtx.current = canvas.getContext('2d')
  }, [drawBar])

  useImperativeHandle(ref, () => {
    return { drawBar }
  }, [drawBar])

  return (
    <div className={c.wrapper} ref={containerRef}>
      <canvas ref={canvasRef} className={c.canvas} width={0} height={0} />
    </div>
  )
})
