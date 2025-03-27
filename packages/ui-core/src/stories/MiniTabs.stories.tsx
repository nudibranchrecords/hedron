import type { Meta } from '@storybook/react'
import { useState } from 'react'
import { MiniTabs, MiniTabsItem } from '@components/MiniTabs/MiniTabs'

const meta = {
  title: 'MiniTabs',
  component: MiniTabs,
} satisfies Meta<typeof MiniTabs>

export default meta

const tabs = ['Audio 1', 'Audio 2', 'MIDI 1', 'LFO 1']

export const Simple = () => {
  const [activeId, setActiveId] = useState(0)
  return (
    <MiniTabs>
      {tabs.map((tab, i) => (
        <MiniTabsItem key={i} onClick={() => setActiveId(i)} isActive={activeId === i}>
          {tab}
        </MiniTabsItem>
      ))}
      <MiniTabsItem iconName="add" />
    </MiniTabs>
  )
}
