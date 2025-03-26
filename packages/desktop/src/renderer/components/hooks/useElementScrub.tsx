import { RefObject, useEffect, useRef } from 'react'

export const useElementScrub = (elRef: RefObject<HTMLElement>, onDrag: (diff: number) => void) => {
  const mouseDownStartX = useRef<number>(0)

  useEffect(() => {
    const el = elRef.current!

    const handleMouseDown = (e: MouseEvent) => {
      mouseDownStartX.current = e.screenX

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    const onMouseMove = (e: MouseEvent) => {
      const diff = (e.screenX - mouseDownStartX.current) / el.offsetWidth
      mouseDownStartX.current = e.screenX
      onDrag(diff)
    }

    const onMouseUp = () => {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
    }

    el.addEventListener('mousedown', handleMouseDown)

    return () => {
      el.removeEventListener('mousedown', handleMouseDown)
      onMouseUp()
    }
  }, [elRef, onDrag])
}
