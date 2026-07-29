import { setGlobalCursor, clearGlobalCursor } from '@hedron-gl/ui-core'
import { useEffect, useRef, useState } from 'react'

const MIN_RATIO = 0.25
const MAX_RATIO = 0.75

export const useHandleDrag = () => {
  const [leftRatio, setLeftRatio] = useState(0.5)
  const isDraggingRef = useRef(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const onHandleMouseDown = () => {
    isDraggingRef.current = true
    setGlobalCursor('col-resize')
  }

  useEffect(() => {
    const applyRatio = (clientX: number) => {
      if (!isDraggingRef.current) return
      const wrapper = wrapperRef.current
      if (!wrapper) return
      const rect = wrapper.getBoundingClientRect()
      let ratio = (clientX - rect.left) / rect.width
      ratio = Math.max(MIN_RATIO, Math.min(MAX_RATIO, ratio))
      setLeftRatio(ratio)
    }

    const stopDragging = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false
        clearGlobalCursor()
      }
    }

    const onMouseMove = (e: MouseEvent) => applyRatio(e.clientX)
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      applyRatio(e.touches[0].clientX)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', stopDragging)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', stopDragging)
    window.addEventListener('touchcancel', stopDragging)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', stopDragging)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', stopDragging)
      window.removeEventListener('touchcancel', stopDragging)
    }
  }, [])

  return { leftRatio, onHandleMouseDown, wrapperRef }
}
