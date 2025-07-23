import c from './MiniTabs.module.css'
import { Icon, IconName } from '@components/Icon/Icon'

export interface MiniTabsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MiniTabs = ({ children, className }: MiniTabsProps) => {
  return <nav className={`${c.wrapper} ${className}`}>{children}</nav>
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
