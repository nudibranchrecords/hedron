import c from './SideTabs.module.css'
import { Icon, IconName } from '@components/core/Icon/Icon'

export interface SideTabsProps {
  children: React.ReactNode
}

export const SideTabs = ({ children }: SideTabsProps) => {
  return <nav className={c.wrapper}>{children}</nav>
}

export interface SideTabsItemProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  onClick?: () => void
  isActive?: boolean
  isSeparate?: boolean
  iconName?: IconName
}

export const SideTabsItem = ({
  children,
  isActive,
  className,
  iconName,
  ...props
}: SideTabsItemProps) => {
  return (
    <button className={`${c.item} ${isActive && 'active'} ${className}`} {...props}>
      {iconName && <Icon name={iconName} className={c.icon} />}
      <span>{children}</span>
    </button>
  )
}
