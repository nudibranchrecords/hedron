import { useState, useEffect, useCallback, useRef } from 'react'
import { useFloating, offset, shift } from '@floating-ui/react-dom'
import { Menu, MenuItem } from '@components/Menu/Menu'

interface PopoutMenuProps {
  children: React.ReactNode
  items: React.ReactNode[] // Updated to allow dynamic content like icons
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

  const inner = (
    <Menu>
      {items.map((item, index) => (
        <MenuItem key={index}>{item}</MenuItem>
      ))}
    </Menu>
  )

  return (
    <div ref={refs.setReference}>
      <div ref={triggerRef} onClick={handleTriggerClick}>
        {children}
      </div>
      {isOpen && (
        <div ref={refs.setFloating} style={floatingStyles}>
          {inner}
        </div>
      )}
    </div>
  )
}
