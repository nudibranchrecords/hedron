import c from './Dialog.module.css'

export interface DialogProps {
  children: React.ReactNode
}

export const Dialog = ({ children }: DialogProps) => <div className={c.wrapper}>{children}</div>
