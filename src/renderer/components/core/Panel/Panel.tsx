import React, { MouseEventHandler, useCallback } from 'react'
import c from './Panel.module.css'
import { Button } from '@components/core/Button/Button'
import { Icon, IconName } from '@components/core/Icon/Icon'

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'full'
}

export const Panel = ({ children, size, className, onClick, ...props }: PanelProps) => {
  const onClickHandler = useCallback<MouseEventHandler<HTMLDivElement>>(
    (e) => {
      e.stopPropagation()
      onClick?.(e)
    },
    [onClick],
  )

  return (
    <div onClick={onClickHandler} className={`${c.wrapper} ${size} ${className}`} {...props}>
      {children}
    </div>
  )
}

export interface PanelHeaderProps {
  children: React.ReactNode
  iconName?: IconName
  buttonIcon?: IconName
  buttonOnClick?: () => void
}

export const PanelHeader = ({
  children,
  iconName,
  buttonIcon = 'close',
  buttonOnClick,
}: PanelHeaderProps) => (
  <div className={c.header}>
    {iconName && <Icon name={iconName} className={c.icon} />}
    <h2>{children}</h2>

    {buttonOnClick && (
      <Button
        className={c.button}
        iconName={buttonIcon}
        size="slim"
        type="neutral"
        onClick={buttonOnClick}
      />
    )}
  </div>
)

export interface PanelBodyProps {
  children: React.ReactNode
  scrollable?: boolean
}

export const PanelBody = ({ children, scrollable }: PanelBodyProps) => (
  <div className={`${c.body} ${scrollable && 'scrollable'}`}>{children}</div>
)

export interface PanelActionsProps {
  children: React.ReactNode
}

export const PanelActions = ({ children }: PanelActionsProps) => (
  <div className={c.actions}>{children}</div>
)
