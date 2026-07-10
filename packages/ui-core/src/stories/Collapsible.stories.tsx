import type { Meta } from '@storybook/react'
import { useState } from 'react'
import { Collapsible } from '@components/Collapsible/Collapsible'

const meta = {
  title: 'Collapsible',
  component: Collapsible,
} satisfies Meta<typeof Collapsible>

export default meta

export const Default = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Collapsible title="Collapsible Title" isOpen={isOpen} onToggle={setIsOpen}>
      Collapsible Content
    </Collapsible>
  )
}

export const Panel = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Collapsible title="Collapsible Title" isOpen={isOpen} onToggle={setIsOpen} type="panel">
      Collapsible Content
    </Collapsible>
  )
}
