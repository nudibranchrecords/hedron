import { RefObject, useEffect, useRef } from 'react'

export const useElementScrub = (elRef: RefObject<HTMLElement>, onDrag: (delta: number) => void) => {
  const startX = useRef<number>(0)

  useEffect(() => {
    const el = elRef.current!

    // Mouse handlers
    const handleMouseDown = (e: MouseEvent) => {
      startX.current = e.screenX

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    const onMouseMove = (e: MouseEvent) => {
      const diff = (e.screenX - startX.current) / el.offsetWidth
      startX.current = e.screenX
      onDrag(diff)
    }

    const onMouseUp = () => {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
    }

    // Touch handlers
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      startX.current = e.touches[0].screenX

      document.addEventListener('touchmove', onTouchMove)
      document.addEventListener('touchend', onTouchEnd)
      document.addEventListener('touchcancel', onTouchEnd)
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const diff = (e.touches[0].screenX - startX.current) / el.offsetWidth
      startX.current = e.touches[0].screenX
      onDrag(diff)
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
