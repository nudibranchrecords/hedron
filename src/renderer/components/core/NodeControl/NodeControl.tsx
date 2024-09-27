import React from 'react'
import c from './NodeControl.module.css'

export interface NodeControlProps {
  isActive?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export const NodeControl = ({ isActive, children, onClick }: NodeControlProps) => {
  return (
    <div onClick={onClick} className={`${c.wrapper} ${isActive && 'active'}`}>
      {children}
    </div>
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
  return <div className={c.inner}>{children}</div>
}
