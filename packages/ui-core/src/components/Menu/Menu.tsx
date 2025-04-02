import c from './Menu.module.css'

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Menu = ({ children, className, ...props }: MenuProps) => {
  return (
    <div className={`${c.wrapper} ${className}`} {...props}>
      {children}
    </div>
  )
}

export interface MenuItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MenuItem = ({ children, className, ...props }: MenuItemProps) => {
  return (
    <div className={`${c.item} ${className}`} {...props}>
      {children}
    </div>
  )
}
