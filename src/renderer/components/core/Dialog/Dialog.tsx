import c from './Dialog.module.css'

export interface DialogProps {
  children: React.ReactNode
  onBackgroundClick?: () => void
}

export const Dialog = ({ children, onBackgroundClick }: DialogProps) => (
  <div onClick={onBackgroundClick} className={c.wrapper}>
    {children}
  </div>
)
