import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import c from './FloatSlider.module.css'
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts'
import { useElementScrub } from '../../hooks/useElementScrub'

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
  const currVal = useRef<number>(0)
  const size = useRef({ width: 0, height: 0 })

  const drawBar = useCallback((value: number) => {
    const ctx = canvasCtx.current

    if (value > 1 || value < 0) {
      throw new Error(`drawBar value must be within range 0-1. Value was ${value}`)
    }
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

    currVal.current = value
  }, [])

  const onResize = useDebounceCallback(({ width, height }: Size) => {
    const canvas = canvasRef.current!
    canvas.height = height!
    canvas.width = width!
    size.current.width = width!
    size.current.height = height!
  }, 200)

  useResizeObserver({
    ref: containerRef,
    onResize,
  })

  useElementScrub(canvasRef, (diff: number) => {
    const newVal = Math.max(0, Math.min(1, currVal.current + diff))

    drawBar(newVal)
  })

  useEffect(() => {
    const canvas = canvasRef.current!
    canvasCtx.current = canvas.getContext('2d')
  }, [])

  useImperativeHandle(ref, () => {
    return { drawBar }
  }, [drawBar])

  return (
    <div className={c.wrapper} ref={containerRef}>
      <canvas ref={canvasRef} className={c.canvas} width={0} height={0} />
    </div>
  )
})
