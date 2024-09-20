import { Icon, IconName } from '../Icon/Icon'
import c from './Button.module.css'

export interface ButtonProps {
  type?: 'primary' | 'secondary' | 'neutral' | 'danger'
  iconName?: IconName
  children: React.ReactNode
  onClick?: () => void
}

export const Button = ({ type = 'primary', children, iconName, ...props }: ButtonProps) => {
  return (
    <button type="button" className={`${c.wrapper} ${type}`} {...props}>
      {iconName && <Icon name={iconName} className={c.icon} />}
      {children}
    </button>
  )
}
