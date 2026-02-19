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
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      const wrapper = wrapperRef.current
      if (!wrapper) return
      const rect = wrapper.getBoundingClientRect()
      let ratio = (e.clientX - rect.left) / rect.width
      ratio = Math.max(MIN_RATIO, Math.min(MAX_RATIO, ratio))
      setLeftRatio(ratio)
    }
    const onMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false
        clearGlobalCursor()
      }
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return { leftRatio, onHandleMouseDown, wrapperRef }
}
