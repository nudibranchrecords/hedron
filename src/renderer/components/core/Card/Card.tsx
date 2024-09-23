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

export interface CardDetailsProps {
  children: React.ReactNode
}

export const CardDetails = ({ children }: CardDetailsProps) => (
  <div className={c.details}>{children}</div>
)

export interface CardBodyProps {
  children: React.ReactNode
}

export const CardBody = ({ children }: CardBodyProps) => <div className={c.body}>{children}</div>

export interface CardActionsProps {
  children: React.ReactNode
  column?: boolean
}

export const CardActions = ({ children, column }: CardActionsProps) => (
  <div className={`${c.actions} ${column && 'column'}`}>{children}</div>
)

export interface CardContentProps {
  children: React.ReactNode
}

export const CardContent = ({ children }: CardContentProps) => (
  <div className={c.content}>{children}</div>
)

export interface CardListProps {
  children: React.ReactNode
}

export const CardList = ({ children }: CardListProps) => <div className={c.list}>{children}</div>
