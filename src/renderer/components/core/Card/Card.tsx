import { Icon, IconName } from '../Icon/Icon'
import c from './Card.module.css'

export interface CardProps {
  children: React.ReactNode
}

export const Card = ({ children }: CardProps) => <div className={c.wrapper}>{children}</div>

export interface CardHeaderProps {
  children: React.ReactNode
  iconName?: IconName
}

export const CardHeader = ({ children, iconName }: CardHeaderProps) => (
  <div className={c.header}>
    {iconName && <Icon name={iconName} className={c.icon} />}
    <h2>{children}</h2>
  </div>
)

export interface CardBodyProps {
  children: React.ReactNode
}

export const CardBody = ({ children }: CardBodyProps) => <div className={c.body}>{children}</div>

export interface CardActionsProps {
  children: React.ReactNode
}

export const CardActions = ({ children }: CardActionsProps) => (
  <div className={c.actions}>{children}</div>
)
