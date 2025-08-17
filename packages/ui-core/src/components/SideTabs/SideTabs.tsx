import c from './SideTabs.module.css'
import { Icon, IconName } from '@components/Icon/Icon'

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
  showErrorIcon?: boolean
}

export const SideTabsItem = ({
  children,
  isActive,
  className,
  iconName,
  showErrorIcon,
  ...props
}: SideTabsItemProps) => {
  return (
    <button
      className={`${c.item} ${isActive && 'active'} ${showErrorIcon && 'isBroken'} ${className}`}
      {...props}
    >
      {iconName && <Icon name={iconName} className={c.icon} />}
      <span>{children}</span>
      {showErrorIcon && (
        <div className={c.errorIcon}>
          <Icon name="error" />
        </div>
      )}
    </button>
  )
}
