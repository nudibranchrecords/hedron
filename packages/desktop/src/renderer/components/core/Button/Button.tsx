import c from './Button.module.css'
import { Icon, IconName } from '@components/core/Icon/Icon'

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  type?: 'primary' | 'secondary' | 'neutral' | 'danger'
  size?: 'slim' | 'small' | 'xsmall'
  disabled?: boolean
  iconName?: IconName
}

export const Button = ({
  type = 'primary',
  children,
  iconName,
  size,
  disabled,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`${c.wrapper} ${c[type]} ${size && c[size]} ${disabled && c.disabled} ${className}`}
      {...props}
    >
      {iconName && <Icon name={iconName} className={c.icon} />}
      {children}
    </button>
  )
}
