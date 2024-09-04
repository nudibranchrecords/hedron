import c from './SideTabs.module.css'

export interface SideTabsProps {
  children: React.ReactNode
}

export const SideTabs = ({ children }: SideTabsProps) => {
  return <nav className={c.wrapper}>{children}</nav>
}

export interface SideTabsItemProps {
  children: React.ReactNode
  isActive?: boolean
}

export const SideTabsItem = ({ children, isActive }: SideTabsItemProps) => {
  return <button className={`${c.item} ${isActive && 'active'}`}>{children}</button>
}
