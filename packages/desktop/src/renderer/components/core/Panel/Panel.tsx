import React, { MouseEventHandler, useCallback } from 'react'
import c from './Panel.module.css'
import { Button } from '@components/core/Button/Button'
import { Icon, IconName } from '@components/core/Icon/Icon'

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: 'full'
  height?: 'full'
  snugPosition?: 'bottom'
  spacing?: 'slim'
}

export const Panel = ({
  children,
  width,
  height,
  className,
  snugPosition,
  spacing,
  onClick,
  ...props
}: PanelProps) => {
  const onClickHandler = useCallback<MouseEventHandler<HTMLDivElement>>(
    (e) => {
      e.stopPropagation()
      onClick?.(e)
    },
    [onClick],
  )

  return (
    <div
      onClick={onClickHandler}
      className={`
        ${c.wrapper}
        ${className}
        ${snugPosition}
        ${width === 'full' && c.widthFull}
        ${height === 'full' && c.heightFull}
        ${spacing === 'slim' && c.slim}
      `}
      {...props}
    >
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
