import c from './ControlGrid.module.css'

export interface ControlGridProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ControlGrid = ({ children, className }: ControlGridProps) => (
  <div className={`${c.wrapper} ${className}`}>{children}</div>
)
