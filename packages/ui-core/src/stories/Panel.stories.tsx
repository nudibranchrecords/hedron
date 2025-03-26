import type { Meta, StoryObj } from '@storybook/react'

import { fn } from '@storybook/test'
import { WithControlGrid } from './NodeControl.stories'
import { Panel, PanelActions, PanelBody, PanelHeader } from '@components/Panel/Panel'
import { Button } from '@components/Button/Button'

const meta = {
  title: 'Panel',
  component: Panel,
  parameters: {},
} satisfies Meta<typeof Panel>

type Story = StoryObj<typeof Panel>

export default meta

export const WithActions = {
  render: () => {
    return (
      <Panel>
        <PanelHeader iconName="info">Welcome to the panel!</PanelHeader>
        <PanelBody>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam recusandae
            voluptatum quidem minus atque, numquam explicabo blanditiis ad corporis eligendi
            delectus, incidunt ipsum harum error. Quidem dolorem exercitationem nostrum dignissimos!
          </p>
        </PanelBody>
        <PanelActions>
          <Button onClick={fn()} iconName="description">
            Choose Project
          </Button>
          <Button type="secondary" iconName="folder_open" onClick={fn()}>
            Choose Sketch Folder
          </Button>
          <Button type="neutral" onClick={fn()}>
            Cancel
          </Button>
        </PanelActions>
      </Panel>
    )
  },
}

export const Scrollable: Story = {
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => {
      return (
        <div style={{ width: '40rem', height: '20rem' }}>
          <Story />
        </div>
      )
    },
  ],
  render: () => {
    return (
      <Panel height="full">
        <PanelHeader iconName="info">Welcome to the panel!</PanelHeader>
        <PanelBody scrollable>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam recusandae
            voluptatum quidem minus atque, numquam explicabo blanditiis ad corporis eligendi
            delectus, incidunt ipsum harum error. Quidem dolorem exercitationem nostrum dignissimos!
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam recusandae
            voluptatum quidem minus atque, numquam explicabo blanditiis ad corporis eligendi
            delectus, incidunt ipsum harum error. Quidem dolorem exercitationem nostrum dignissimos!
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam recusandae
            voluptatum quidem minus atque, numquam explicabo blanditiis ad corporis eligendi
            delectus, incidunt ipsum harum error. Quidem dolorem exercitationem nostrum dignissimos!
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam recusandae
            voluptatum quidem minus atque, numquam explicabo blanditiis ad corporis eligendi
            delectus, incidunt ipsum harum error. Quidem dolorem exercitationem nostrum dignissimos!
          </p>
        </PanelBody>
        <PanelActions>
          <Button onClick={fn()} iconName="description">
            Choose Project
          </Button>
          <Button type="secondary" iconName="folder_open" onClick={fn()}>
            Choose Sketch Folder
          </Button>
          <Button type="neutral" onClick={fn()}>
            Cancel
          </Button>
        </PanelActions>
      </Panel>
    )
  },
}

export const ScrollableWithoutActions: Story = {
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => {
      return (
        <div style={{ width: '40rem', height: '20rem' }}>
          <Story />
        </div>
      )
    },
  ],
  render: () => {
    return (
      <Panel height="full">
        <PanelHeader iconName="info">Welcome to the panel!</PanelHeader>
        <PanelBody scrollable>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam recusandae
            voluptatum quidem minus atque, numquam explicabo blanditiis ad corporis eligendi
            delectus, incidunt ipsum harum error. Quidem dolorem exercitationem nostrum dignissimos!
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam recusandae
            voluptatum quidem minus atque, numquam explicabo blanditiis ad corporis eligendi
            delectus, incidunt ipsum harum error. Quidem dolorem exercitationem nostrum dignissimos!
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam recusandae
            voluptatum quidem minus atque, numquam explicabo blanditiis ad corporis eligendi
            delectus, incidunt ipsum harum error. Quidem dolorem exercitationem nostrum dignissimos!
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam recusandae
            voluptatum quidem minus atque, numquam explicabo blanditiis ad corporis eligendi
            delectus, incidunt ipsum harum error. Quidem dolorem exercitationem nostrum dignissimos!
          </p>
        </PanelBody>
      </Panel>
    )
  },
}

export const WithCloseButton: Story = {
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => {
      return (
        <div style={{ width: '40rem', height: '20rem' }}>
          <Story />
        </div>
      )
    },
  ],
  render: () => {
    return (
      <Panel>
        <PanelHeader iconName="info" buttonOnClick={fn()}>
          Welcome to the panel!
        </PanelHeader>
        <PanelBody>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam recusandae
            voluptatum quidem minus atque, numquam explicabo blanditiis ad corporis eligendi
            delectus, incidunt ipsum harum error. Quidem dolorem exercitationem nostrum dignissimos!
          </p>
        </PanelBody>
      </Panel>
    )
  },
}

export const BottomPanel: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <Story />
        </div>
      )
    },
  ],
  render: () => {
    return (
      <Panel snugPosition="bottom" spacing="slim" width="full">
        <PanelHeader iconName="power" buttonOnClick={fn()}>
          Position X Input
        </PanelHeader>
        <PanelBody>
          <WithControlGrid />
        </PanelBody>
      </Panel>
    )
  },
}
