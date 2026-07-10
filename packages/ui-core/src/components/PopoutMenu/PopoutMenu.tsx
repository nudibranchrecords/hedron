import { useState, useEffect, useCallback, useRef } from 'react'
import { useFloating, offset, shift, autoPlacement } from '@floating-ui/react-dom'
import c from './PopoutMenu.module.css'
import { Menu, MenuItem } from '@components/Menu/Menu'
import { Icon, IconName } from '@components/Icon/Icon'
interface MenuItemConfig {
  label: string | JSX.Element
  onClick: () => void
  icon?: IconName
}

export interface PopoutMenuProps extends React.HTMLProps<HTMLDivElement> {
  items: MenuItemConfig[]
}

export const PopoutMenu = ({ children, items, className, ...props }: PopoutMenuProps) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles } = useFloating({
    middleware: [offset(10), shift({ padding: 10 }), autoPlacement()],
  })

  const handleTriggerClick = () => setIsOpen((prev) => !prev)

  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (!triggerRef.current?.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [handleOutsideClick])

  return (
    <div ref={refs.setReference} className={className} {...props}>
      <div ref={triggerRef} onClick={handleTriggerClick}>
        {children}
      </div>
      {isOpen && (
        <div ref={refs.setFloating} style={floatingStyles} className={c.popout}>
          <Menu className={c.menu}>
            {items.map(({ label, onClick, icon }, index) => (
              <MenuItem key={index} onClick={onClick}>
                {icon && <Icon name={icon} />}
                {label}
              </MenuItem>
            ))}
          </Menu>
        </div>
      )}
    </div>
  )
}
