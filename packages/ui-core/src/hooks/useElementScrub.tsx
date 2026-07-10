import { useEffect, useRef, type RefObject } from 'react'
import { clearGlobalCursor, CursorCSSValue, setGlobalCursor } from '@utils/setGlobalCursor'

export const useElementScrub = (
  elRef: RefObject<HTMLElement>,
  onDrag: (delta: { x: number; y: number }) => void,
  cursorCSSValue?: CursorCSSValue,
) => {
  const startX = useRef<number>(0)
  const startY = useRef<number>(0)

  useEffect(() => {
    const el = elRef.current

    if (!el) return

    if (cursorCSSValue) {
      el.style.cursor = cursorCSSValue
    }

    const start = (x: number, y: number) => {
      startX.current = x
      startY.current = y

      if (cursorCSSValue) {
        setGlobalCursor(cursorCSSValue)
      }
    }

    const end = () => {
      if (cursorCSSValue) {
        clearGlobalCursor()
      }
    }

    const move = (x: number, y: number) => {
      const diffX = (x - startX.current) / el.offsetWidth
      const diffY = (y - startY.current) / el.offsetHeight
      startX.current = x
      startY.current = y
      onDrag({ x: diffX, y: diffY })
    }

    // Mouse handlers
    const handleMouseDown = (e: MouseEvent) => {
      start(e.screenX, e.screenY)

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    const onMouseMove = (e: MouseEvent) => {
      move(e.screenX, e.screenY)
    }

    const onMouseUp = () => {
      end()
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
    }

    // Touch handlers
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return

      start(e.touches[0].screenX, e.touches[0].screenY)

      document.addEventListener('touchmove', onTouchMove)
      document.addEventListener('touchend', onTouchEnd)
      document.addEventListener('touchcancel', onTouchEnd)
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      move(e.touches[0].screenX, e.touches[0].screenY)
    }

    const onTouchEnd = () => {
      end()
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('touchcancel', onTouchEnd)
    }

    el.addEventListener('mousedown', handleMouseDown)
    el.addEventListener('touchstart', handleTouchStart)

    return () => {
      el.style.cursor = ''
      end()
      el.removeEventListener('mousedown', handleMouseDown)
      el.removeEventListener('touchstart', handleTouchStart)
      onMouseUp()
      onTouchEnd()
    }
  }, [elRef, onDrag, cursorCSSValue])
}
