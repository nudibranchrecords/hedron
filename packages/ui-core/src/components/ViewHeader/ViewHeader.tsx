import c from './ViewHeader.module.css'

export interface ViewHeaderProps {
  children: React.ReactNode
  className?: string
}

export const ViewHeader = ({ children, className }: ViewHeaderProps) => {
  return <div className={`${c.wrapper} ${className || ''}`}>{children}</div>
}
