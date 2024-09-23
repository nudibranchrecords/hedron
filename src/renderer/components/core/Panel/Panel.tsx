import { Icon, IconName } from '../Icon/Icon'
import c from './Panel.module.css'

export interface PanelProps {
  children: React.ReactNode
  size?: 'full'
}

export const Panel = ({ children, size }: PanelProps) => (
  <div className={`${c.wrapper} ${size}`}>{children}</div>
)

export interface PanelHeaderProps {
  children: React.ReactNode
  iconName?: IconName
}

export const PanelHeader = ({ children, iconName }: PanelHeaderProps) => (
  <div className={c.header}>
    {iconName && <Icon name={iconName} className={c.icon} />}
    <h2>{children}</h2>
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
