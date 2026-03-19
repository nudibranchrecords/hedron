import React from 'react'
import c from './Panel.module.css'
import { Button } from '@components/Button/Button'
import { Icon, IconName } from '@components/Icon/Icon'

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
  ...props
}: PanelProps) => {
  return (
    <div
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
      <Button className={c.button} iconName={buttonIcon} type="ghost" onClick={buttonOnClick} />
    )}
  </div>
)

export interface BreadcrumbItem {
  label: string
  id: string
  onClick?: () => void
}

export interface PanelBreadcrumbsProps {
  items: BreadcrumbItem[]
}

export const PanelBreadcrumbs = ({ items }: PanelBreadcrumbsProps) => (
  <div className={c.breadcrumbs}>
    {items.map((item, i) => (
      <React.Fragment key={item.id}>
        {i > 0 && <span className={c.breadcrumbSeparator}>/</span>}
        <span
          className={`${c.breadcrumbItem} ${item.onClick ? c.breadcrumbClickable : ''}`}
          onClick={item.onClick}
        >
          {item.label}
        </span>
      </React.Fragment>
    ))}
  </div>
)

export const PanelSubHeader = ({
  title,
  children,
  iconName,
}: {
  title: string
  children?: React.ReactNode
  iconName?: IconName
}) => (
  <header className={c.subHeader}>
    {iconName && <Icon name={iconName} />}
    <h3>{title}</h3>
    {children}
  </header>
)

export interface PanelBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  scrollable?: boolean
}

export const PanelBody = ({ children, scrollable, className }: PanelBodyProps) => (
  <div className={`themeLevel1 ${c.body} ${scrollable && 'scrollable'} ${className}`}>
    {children}
  </div>
)

export interface PanelActionsProps {
  children: React.ReactNode
}

export const PanelActions = ({ children }: PanelActionsProps) => (
  <div className={c.actions}>{children}</div>
)
