import c from './Dialog.module.css'

export interface DialogProps {
  children: React.ReactNode
  onBackgroundClick?: () => void
}

export const Dialog = ({ children, onBackgroundClick }: DialogProps) => (
  <>
    <div className={c.background} onClick={onBackgroundClick}></div>
    <div className={c.wrapper}>{children}</div>
  </>
)
