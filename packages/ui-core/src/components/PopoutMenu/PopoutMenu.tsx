import { useState, useEffect, useCallback, useRef } from 'react'
import { useFloating, offset, shift } from '@floating-ui/react-dom'
import { Menu, MenuItem } from '@components/Menu/Menu'
import { Icon, IconName } from '@components/Icon/Icon'

interface MenuItemConfig {
  label: string
  onClick: () => void
  icon?: IconName
}

interface PopoutMenuProps {
  children: React.ReactNode
  items: MenuItemConfig[]
}

export const PopoutMenu = ({ children, items }: PopoutMenuProps) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles } = useFloating({
    middleware: [offset(10), shift()],
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
    <div ref={refs.setReference}>
      <div ref={triggerRef} onClick={handleTriggerClick}>
        {children}
      </div>
      {isOpen && (
        <div ref={refs.setFloating} style={floatingStyles}>
          <Menu>
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
