import c from './IconList.module.css'
import { Icon, IconName } from '@components/core/Icon/Icon'

export interface IconListProps {
  children: React.ReactNode
}

export const IconList = ({ children }: IconListProps) => <div className={c.wrapper}>{children}</div>

export interface CardHeaderProps {
  children: React.ReactNode
  iconName: IconName
}

export const IconListItem = ({ iconName, children }: CardHeaderProps) => (
  <div className={c.item}>
    <Icon name={iconName} className={c.icon} /> {children}
  </div>
)
