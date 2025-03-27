import React, { useCallback } from 'react'
import c from './NodeControl.module.css'
import {
  MouseDownContext,
  useWasMouseDownOnInnerContext,
  useMouseDownOnInner,
} from './wasMouseDownOnInner'

export interface NodeControlProps {
  isActive?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export const NodeControl = ({ isActive, children, onClick }: NodeControlProps) => {
  const wasMouseDownOnInner = useWasMouseDownOnInnerContext()

  const handleClick = useCallback(() => {
    // Disable click event if mouse down started on inner
    if (!wasMouseDownOnInner.current) {
      onClick?.()
    }
  }, [wasMouseDownOnInner, onClick])

  return (
    <MouseDownContext.Provider value={wasMouseDownOnInner}>
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
  // Register mouse down on inner so click can be disabled if mouse is released outside of this component
  const handleMouseDown = useMouseDownOnInner()

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }, [])

  return (
    <div className={c.inner} onClick={handleClick} onMouseDown={handleMouseDown}>
      {children}
    </div>
  )
}
