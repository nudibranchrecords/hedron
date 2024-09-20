import c from './Button.module.css'

export interface ButtonProps {
  type?: 'primary' | 'secondary' | 'neutral'
  children: React.ReactNode
  onClick?: () => void
}

export const Button = ({ type = 'primary', children, ...props }: ButtonProps) => {
  return (
    <button type="button" className={`${c.wrapper} ${type}`} {...props}>
      {children}
    </button>
  )
}
