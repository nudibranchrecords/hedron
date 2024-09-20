import type { Meta } from '@storybook/react'
import {
  Panel,
  PanelActions,
  PanelBody,
  PanelHeader,
} from '../renderer/components/core/Panel/Panel'
import { fn } from '@storybook/test'
import { Button } from '../renderer/components/core/Button/Button'

const meta = {
  title: 'Panel',
  component: Panel,
  parameters: {},
} satisfies Meta<typeof Panel>

export default meta

export const WithActions = () => {
  return (
    <Panel>
      <PanelHeader iconName="info">Welcome to the panel!</PanelHeader>
      <PanelBody>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam recusandae voluptatum
          quidem minus atque, numquam explicabo blanditiis ad corporis eligendi delectus, incidunt
          ipsum harum error. Quidem dolorem exercitationem nostrum dignissimos!
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
}
