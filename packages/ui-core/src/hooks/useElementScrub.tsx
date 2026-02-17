import { RefObject, useEffect, useRef } from 'react'

export const useElementScrub = (
  elRef: RefObject<HTMLElement>,
  onDrag: (delta: { x: number; y: number }) => void,
) => {
  const startX = useRef<number>(0)
  const startY = useRef<number>(0)

  useEffect(() => {
    const el = elRef.current!

    // Mouse handlers
    const handleMouseDown = (e: MouseEvent) => {
      startX.current = e.screenX
      startY.current = e.screenY

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    const onMouseMove = (e: MouseEvent) => {
      const diffX = (e.screenX - startX.current) / el.offsetWidth
      const diffY = (e.screenY - startY.current) / el.offsetHeight
      startX.current = e.screenX
      startY.current = e.screenY
      onDrag({ x: diffX, y: diffY })
    }

    const onMouseUp = () => {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
    }

    // Touch handlers
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      startX.current = e.touches[0].screenX
      startY.current = e.touches[0].screenY

      document.addEventListener('touchmove', onTouchMove)
      document.addEventListener('touchend', onTouchEnd)
      document.addEventListener('touchcancel', onTouchEnd)
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const diffX = (e.touches[0].screenX - startX.current) / el.offsetWidth
      const diffY = (e.touches[0].screenY - startY.current) / el.offsetHeight
      startX.current = e.touches[0].screenX
      startY.current = e.touches[0].screenY
      onDrag({ x: diffX, y: diffY })
    }

    const onTouchEnd = () => {
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('touchcancel', onTouchEnd)
    }

    el.addEventListener('mousedown', handleMouseDown)
    el.addEventListener('touchstart', handleTouchStart)

    return () => {
      el.removeEventListener('mousedown', handleMouseDown)
      el.removeEventListener('touchstart', handleTouchStart)
      onMouseUp()
      onTouchEnd()
    }
  }, [elRef, onDrag])
}
