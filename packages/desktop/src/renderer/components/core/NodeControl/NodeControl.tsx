import React, { useCallback, useRef, createContext, useContext, useEffect } from 'react'
import c from './NodeControl.module.css'

export interface NodeControlProps {
  isActive?: boolean
  children: React.ReactNode
  onClick?: () => void
}

const MouseDownContext = createContext<React.MutableRefObject<boolean> | null>(null)

export const NodeControl = ({ isActive, children, onClick }: NodeControlProps) => {
  const isMouseDown = useRef(false)

  const handleClick = useCallback(() => {
    if (!isMouseDown.current) {
      onClick?.()
    }
  }, [onClick])

  return (
    <MouseDownContext.Provider value={isMouseDown}>
      <div onClick={handleClick} className={`${c.wrapper} ${isActive && 'active'}`}>
        {children}
      </div>
    </MouseDownContext.Provider>
  )
}

export interface NodeControlMainProps {
  children: React.ReactNode
}

export const NodeControlMain = ({ children }: NodeControlMainProps) => (
  <div className={c.main}>{children}</div>
)

export interface NodeControlTitleProps {
  children: React.ReactNode
}

export const NodeControlTitle = ({ children }: NodeControlTitleProps) => (
  <div className={c.title}>{children}</div>
)

export interface NodeControlInnerProps {
  children: React.ReactNode
}

export const NodeControlInner = ({ children }: NodeControlInnerProps) => {
  const isMouseDown = useContext(MouseDownContext)

  const handleMouseDown = useCallback(() => {
    if (isMouseDown) {
      isMouseDown.current = true
    }
  }, [isMouseDown])

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }, [])

  useEffect(() => {
    const handleDocumentMouseUp = () => {
      if (isMouseDown) {
        setTimeout(() => {
          isMouseDown.current = false
        }, 0)
      }
    }

    // Add global mouseup listener
    document.addEventListener('mouseup', handleDocumentMouseUp)

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener('mouseup', handleDocumentMouseUp)
    }
  }, [isMouseDown])

  return (
    <div className={c.inner} onClick={handleClick} onMouseDown={handleMouseDown}>
      {children}
    </div>
  )
}
