import { useState, useEffect } from 'react'
import { useFloating, offset, shift } from '@floating-ui/react-dom'
import { Menu, MenuItem } from '@components/Menu/Menu'

interface PopoutMenuProps {
  trigger: React.ReactNode
  items: React.ReactNode[] // Updated to allow dynamic content like icons
}

export const PopoutMenu = ({ trigger, items }: PopoutMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles } = useFloating({
    middleware: [offset(10), shift()],
  })

  const handleTriggerClick = () => setIsOpen((prev) => !prev)

  const handleOutsideClick = (e: MouseEvent) => {
    if (!refs.reference.current?.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [])

  return (
    <div>
      <div ref={refs.setReference} onClick={handleTriggerClick}>
        {trigger}
      </div>
      {isOpen && (
        <div ref={refs.setFloating} style={floatingStyles}>
          <Menu>
            {items.map((item, index) => (
              <MenuItem key={index}>{item}</MenuItem>
            ))}
          </Menu>
        </div>
      )}
    </div>
  )
}
