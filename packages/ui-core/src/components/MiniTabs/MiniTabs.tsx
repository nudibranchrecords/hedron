import { PropsWithChildren } from 'react'
import c from './MiniTabs.module.css'
import { Icon, IconName } from '@components/Icon/Icon'

export const MiniTabs = ({ children }: PropsWithChildren) => {
  return <nav className={c.wrapper}>{children}</nav>
}

export interface MiniTabsItemProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  onClick?: () => void
  isActive?: boolean
  isSeparate?: boolean
  iconName?: IconName
}

export const MiniTabsItem = ({
  children,
  isActive,
  className,
  iconName,
  ...props
}: MiniTabsItemProps) => {
  return (
    <button className={`${c.item} ${isActive && c.active} ${className}`} {...props}>
      {iconName && <Icon name={iconName} className={c.icon} />}
      <span>{children}</span>
    </button>
  )
}
