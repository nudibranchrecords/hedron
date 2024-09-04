import type { Meta } from '@storybook/react'
import { SideTabs, SideTabsItem } from '../renderer/components/core/SideTabs/SideTabs'

const meta = {
  title: 'SideTabs',
  component: SideTabs,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SideTabs>

export default meta

export const Simple = {
  render: () => (
    <SideTabs>
      <SideTabsItem>foo</SideTabsItem>
      <SideTabsItem isActive>bar</SideTabsItem>
      <SideTabsItem>long sketch name</SideTabsItem>
    </SideTabs>
  ),
}
