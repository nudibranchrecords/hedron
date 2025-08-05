import React from 'react'
import c from './Button.module.css'
import { Icon, IconName } from '@components/Icon/Icon'

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  type?: 'primary' | 'secondary' | 'neutral' | 'ghost' | 'danger'
  size?: 'slim' | 'short'
  disabled?: boolean
  iconName?: IconName
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ type = 'primary', children, iconName, size, disabled, className, ...props }, ref) => {
    return (
      <button
        type="button"
        className={`${c.wrapper} ${c[type]} ${size && c[size]} ${disabled && c.disabled} ${className}`}
        ref={ref}
        {...props}
      >
        {iconName && <Icon name={iconName} className={c.icon} />}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
