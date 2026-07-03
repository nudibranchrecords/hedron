import { PropsWithChildren, useCallback } from 'react'
import c from './Collapsible.module.css'
import { collapseCloseIcon, collapseOpenIcon, Icon } from '@components/Icon/Icon'

export interface CollapsibleProps extends PropsWithChildren {
  title: string
  isOpen: boolean
  onToggle: (isOpen: boolean) => void
  className?: string
  type?: 'default' | 'panel'
}

export const Collapsible = ({
  title,
  isOpen,
  onToggle,
  children,
  className,
  type = 'default',
}: CollapsibleProps) => {
  const _onToggle = useCallback(() => {
    onToggle(!isOpen)
  }, [onToggle, isOpen])

  const iconName = isOpen ? collapseCloseIcon : collapseOpenIcon

  return (
    <div className={`${className} ${type === 'panel' ? `${c.panel} themeLevel1` : ''}`}>
      <h3 className={c.header} onClick={_onToggle}>
        <Icon name={iconName} /> {title}
      </h3>
      {isOpen && <div className={c.content}>{children}</div>}
    </div>
  )
}
