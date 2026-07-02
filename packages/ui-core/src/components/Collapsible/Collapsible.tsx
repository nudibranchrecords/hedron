import { PropsWithChildren, useCallback } from 'react'
import c from './Collapsible.module.css'
import { collapseCloseIcon, collapseOpenIcon, Icon } from '@components/Icon/Icon'

export interface CollapsibleProps extends PropsWithChildren {
  title: string
  isOpen: boolean
  onToggle: (isOpen: boolean) => void
  className?: string
}

export const Collapsible = ({ title, isOpen, onToggle, children, className }: CollapsibleProps) => {
  const _onToggle = useCallback(() => {
    onToggle(!isOpen)
  }, [onToggle, isOpen])

  const iconName = isOpen ? collapseCloseIcon : collapseOpenIcon

  return (
    <div className={className}>
      <h3 className={c.header} onClick={_onToggle}>
        <Icon name={iconName} /> {title}
      </h3>
      {isOpen && <div>{children}</div>}
    </div>
  )
}
