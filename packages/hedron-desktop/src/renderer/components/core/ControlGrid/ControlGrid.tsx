import c from './ControlGrid.module.css'

export interface ControlGridProps {
  children: React.ReactNode
}

export const ControlGrid = ({ children }: ControlGridProps) => (
  <div className={c.wrapper}>{children}</div>
)
