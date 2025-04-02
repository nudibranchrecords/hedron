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
    <PopoutMenu
      items={[
        {
          label: 'Wow!',
          onClick: () => {},
        },
        {
          label: 'Copy',
          onClick: () => {},
        },
        {
          label: 'Delete',
          onClick: () => {},
        },
      ]}
    >
      <Button>Open Menu</Button>
    </PopoutMenu>
  )
}

export const WithIcons = () => {
  return (
    <PopoutMenu
      items={[
        {
          label: 'Wow!',
          icon: 'bolt',
          onClick: () => {},
        },
        {
          label: 'Copy',
          icon: 'content_copy',
          onClick: () => {},
        },
        {
          label: 'Delete',
          icon: 'delete',
          onClick: () => {},
        },
      ]}
    >
      <Button>Open Menu</Button>
    </PopoutMenu>
  )
}
