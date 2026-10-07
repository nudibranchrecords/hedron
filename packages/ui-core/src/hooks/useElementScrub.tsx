import { useEffect, useRef, type RefObject } from 'react'
import { clearGlobalCursor, CursorCSSValue, setGlobalCursor } from '@utils/setGlobalCursor'

// Touch movement (in screen px) before a gesture's axis is decided, for `axis` locked scrubs
const AXIS_LOCK_THRESHOLD = 8

type ScrubAxis = 'x' | 'y' | 'free'
type GestureState = 'pending' | 'active' | 'cancelled'

export const useElementScrub = (
  elRef: RefObject<HTMLElement>,
  onDrag: (delta: { x: number; y: number }) => void,
  cursorCSSValue?: CursorCSSValue,
  axis: ScrubAxis = 'free',
) => {
  const startX = useRef<number>(0)
  const startY = useRef<number>(0)
  // Only used on touch: lets a vertical (or horizontal) swipe fall through to native
  // scrolling instead of being captured as a drag, when `axis` locks this scrub to one axis.
  const gestureState = useRef<GestureState>('active')

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

      gestureState.current = axis === 'free' ? 'active' : 'pending'
      start(e.touches[0].screenX, e.touches[0].screenY)

      document.addEventListener('touchmove', onTouchMove)
      document.addEventListener('touchend', onTouchEnd)
      document.addEventListener('touchcancel', onTouchEnd)
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return

      const { screenX: x, screenY: y } = e.touches[0]

      if (gestureState.current === 'cancelled') return

      if (gestureState.current === 'pending') {
        const diffX = x - startX.current
        const diffY = y - startY.current

        if (Math.max(Math.abs(diffX), Math.abs(diffY)) < AXIS_LOCK_THRESHOLD) return

        // Gesture moved mostly along the axis we don't own (e.g. a vertical scroll
        // swipe crossing a horizontal slider) - bail out and let it scroll natively.
        const isCrossAxis =
          (axis === 'x' && Math.abs(diffY) > Math.abs(diffX)) ||
          (axis === 'y' && Math.abs(diffX) > Math.abs(diffY))

        if (isCrossAxis) {
          gestureState.current = 'cancelled'
          return
        }

        gestureState.current = 'active'
      }

      move(x, y)
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
