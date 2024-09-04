import c from './styles.module.css'

export interface ButtonProps {
  type?: 'primary' | 'secondary'
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
