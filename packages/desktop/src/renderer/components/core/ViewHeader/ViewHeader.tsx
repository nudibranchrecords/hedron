import c from './ViewHeader.module.css'

export interface ViewHeaderProps {
  children: React.ReactNode
}

export const ViewHeader = ({ children }: ViewHeaderProps) => {
  return <div className={c.wrapper}>{children}</div>
}
