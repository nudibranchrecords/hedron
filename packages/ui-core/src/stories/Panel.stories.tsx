import type { Decorator, Meta, StoryObj } from '@storybook/react'

import { fn } from '@storybook/test'
import { WithControlGrid } from './NodeControl.stories'
import { Icon } from '@components/Icon/Icon'
import {
  Panel,
  PanelActions,
  PanelBody,
  PanelHeader,
  PanelSubHeader,
  PanelBreadcrumbs,
} from '@components/Panel/Panel'
import { Button } from '@components/Button/Button'

const bottomDecorator: Decorator = (Story) => {
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
}

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
  decorators: [bottomDecorator],
  render: () => {
    return (
      <Panel snugPosition="bottom" spacing="slim" width="full">
        <PanelHeader iconName="power" buttonOnClick={fn()}>
          Position X Input
        </PanelHeader>
        <PanelBody>
          <PanelSubHeader title="Subheader Title" iconName="info">
            <Button size="slim" type="ghost" className="mr-auto" onClick={fn()}>
              <Icon name="edit" />
            </Button>
            <Button size="slim" type="ghost" onClick={fn()}>
              <Icon name="delete" />
            </Button>
          </PanelSubHeader>
          <WithControlGrid />
        </PanelBody>
      </Panel>
    )
  },
}

export const BottomPanelWithBreadcrumbs: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [bottomDecorator],
  render: () => {
    return (
      <Panel snugPosition="bottom" spacing="slim" width="full">
        <PanelHeader iconName="tune" buttonOnClick={fn()}>
          <PanelBreadcrumbs
            items={[
              { label: 'Logo', id: 'sketch-1', onClick: fn() },
              { label: 'Speed', id: 'param-1' },
            ]}
          />
        </PanelHeader>
        <PanelBody>
          <p>Panel content with breadcrumbs in the header.</p>
        </PanelBody>
      </Panel>
    )
  },
}

export const WithClickableBreadcrumbs: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [bottomDecorator],
  render: () => {
    return (
      <Panel snugPosition="bottom" spacing="slim" width="full">
        <PanelHeader iconName="tune" buttonOnClick={fn()}>
          <PanelBreadcrumbs
            items={[
              { label: 'My Awesome Sketch', id: 'sketch-1', onClick: fn() },
              { label: 'Material Settings', id: 'group-1', onClick: fn() },
              { label: 'Diffuse Color', id: 'param-1' },
            ]}
          />
        </PanelHeader>
        <PanelBody>
          <WithControlGrid />
        </PanelBody>
      </Panel>
    )
  },
}
