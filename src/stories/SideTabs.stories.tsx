import type { Meta } from '@storybook/react'
import { useState } from 'react'
import { SideTabs, SideTabsItem } from '../renderer/components/core/SideTabs/SideTabs'

const meta = {
  title: 'SideTabs',
  component: SideTabs,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '4rem', height: '100vh' }}>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof SideTabs>

export default meta

const tabs = ['solid', 'stars', 'whizzy whizz', 'foo', 'bar', 'long sketch name']

export const Simple = () => {
  const [activeId, setActiveId] = useState(0)
  return (
    <SideTabs>
      {tabs.map((tab, i) => (
        <SideTabsItem key={i} onClick={() => setActiveId(i)} isActive={activeId === i}>
          {tab}
        </SideTabsItem>
      ))}
      <SideTabsItem iconName="add_circle" />
    </SideTabs>
  )
}
