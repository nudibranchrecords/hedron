/*
  These hooks are used to disable clicks on a parent component if some inner component was first clicked.
  e.g. we don't want to select a node if we are dragging a slider inside the node, and the mouse is released outside the slider.
*/

import React, { useRef, createContext, useEffect, useContext, useCallback } from 'react'

export const MouseDownContext = createContext<React.MutableRefObject<boolean> | null>(null)

export const useWasMouseDownOnInnerContext = () => {
  const isMouseDown = useRef(false)
  useEffect(() => {
    const handleDocumentEnd = () => {
      if (isMouseDown) {
        // Wait for the next frame to set isMouseDown to false so the flag can be used in the click event
        requestAnimationFrame(() => {
          isMouseDown.current = false
        })
      }
    }

    document.addEventListener('mouseup', handleDocumentEnd)
    document.addEventListener('touchend', handleDocumentEnd)
    document.addEventListener('touchcancel', handleDocumentEnd)

    return () => {
      document.removeEventListener('mouseup', handleDocumentEnd)
      document.removeEventListener('touchend', handleDocumentEnd)
      document.removeEventListener('touchcancel', handleDocumentEnd)
    }
  }, [isMouseDown])

  return isMouseDown
}

export const useMouseDownOnInner = () => {
  const isMouseDownOnInner = useContext(MouseDownContext)

  const handleMouseDown = useCallback(() => {
    if (isMouseDownOnInner) {
      isMouseDownOnInner.current = true
    }
  }, [isMouseDownOnInner])

  const handleTouchStart = useCallback(() => {
    if (isMouseDownOnInner) {
      isMouseDownOnInner.current = true
    }
  }, [isMouseDownOnInner])

  return { handleMouseDown, handleTouchStart }
}
