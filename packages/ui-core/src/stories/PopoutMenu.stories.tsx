import type { Meta } from '@storybook/react'
import { PopoutMenu } from '@components/PopoutMenu/PopoutMenu'
import { Button } from '@components/Button/Button'

const meta = {
  title: 'PopoutMenu',
  component: PopoutMenu,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PopoutMenu>

export default meta

export const Default = () => {
  return (
    <PopoutMenu items={['Option 1', 'Option 2', 'Option 3']}>
      <Button>Open Menu</Button>
    </PopoutMenu>
  )
}
