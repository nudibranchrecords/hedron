import c from './NodeControl.module.css'

export interface NodeControlProps {
  title: string
  isActive?: boolean
}

export const NodeControl = ({ isActive, title }: NodeControlProps) => {
  return (
    <div className={`${c.wrapper} ${isActive && 'active'}`}>
      <div className={c.main}>
        <div className={c.title}>{title}</div>
        <div className={c.inner}>--</div>
      </div>
    </div>
  )
}
