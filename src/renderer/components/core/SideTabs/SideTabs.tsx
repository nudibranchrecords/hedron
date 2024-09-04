import c from './SideTabs.module.css'

export interface SideTabsProps {
  children: React.ReactNode
}

export const SideTabs = ({ children }: SideTabsProps) => {
  return <nav className={c.wrapper}>{children}</nav>
}

export interface SideTabsItemProps {
  children: React.ReactNode
  onClick?: () => void
  isActive?: boolean
}

export const SideTabsItem = ({ children, isActive, onClick }: SideTabsItemProps) => {
  return (
    <button onClick={onClick} className={`${c.item} ${isActive && 'active'}`}>
      {children}
    </button>
  )
}
