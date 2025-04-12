import type { Meta } from '@storybook/react'

import { useState } from 'react'
import { fn } from '@storybook/test'
import {
  Card,
  CardActions,
  CardBody,
  CardContent,
  CardDetails,
  CardHeader,
  CardList,
} from '@components/Card/Card'
import { sketchIcon } from '@components/Icon/Icon'
import { Panel, PanelBody, PanelHeader } from '@components/Panel/Panel'
import { Dialog } from '@components/Dialog/Dialog'
import { Button } from '@components/Button/Button'

const meta = {
  title: 'Dialog',
  parameters: {
    layout: 'fullscreen',
  },
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta

export const Basic = () => {
  const [isHidden, setIsHidden] = useState(true)

  return (
    <>
      <div style={{ padding: '2rem' }}>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam temporibus corporis
          incidunt quos atque modi quisquam, quis aliquid provident obcaecati exercitationem minima,
          eum nesciunt at, sed iure id libero! Accusamus.
        </p>
        <Button onClick={() => setIsHidden(false)}>Open Dialog</Button>
      </div>
      {!isHidden && (
        <Dialog
          onBackgroundClick={() => {
            setIsHidden(true)
            console.log('what')
          }}
        >
          <Panel>
            <PanelHeader iconName="info" buttonOnClick={() => setIsHidden(true)}>
              This is a popup
            </PanelHeader>
            <PanelBody>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam recusandae
                voluptatum quidem minus atque, numquam explicabo blanditiis ad corporis eligendi
                delectus, incidunt ipsum harum error. Quidem dolorem exercitationem nostrum
                dignissimos!
              </p>
            </PanelBody>
          </Panel>
        </Dialog>
      )}
    </>
  )
}

const CardExample = () => (
  <Card>
    <CardContent>
      <CardHeader iconName="token">Sketch: Starfield</CardHeader>
      <CardDetails>tags, something, foo, bar</CardDetails>
      <CardBody>
        <p>Some stars fly through the scene.</p>
      </CardBody>
    </CardContent>
    <CardActions>
      <Button onClick={fn()} iconName="add">
        Add To Scene
      </Button>
    </CardActions>
  </Card>
)

export const WithScroll = () => {
  const [isHidden, setIsHidden] = useState(true)

  return (
    <>
      <div style={{ padding: '2rem' }}>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam temporibus corporis
          incidunt quos atque modi quisquam, quis aliquid provident obcaecati exercitationem minima,
          eum nesciunt at, sed iure id libero! Accusamus.
        </p>
        <Button onClick={() => setIsHidden(false)}>Open Dialog</Button>
      </div>
      {!isHidden && (
        <Dialog onBackgroundClick={() => setIsHidden(true)}>
          <Panel width="full" height="full" style={{ maxWidth: '60rem' }}>
            <PanelHeader iconName={sketchIcon} buttonOnClick={() => setIsHidden(true)}>
              Add Sketch To Scene
            </PanelHeader>
            <PanelBody scrollable>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam recusandae
                voluptatum quidem minus atque.
              </p>
              <CardList>
                <CardExample />
                <CardExample />
                <CardExample />
                <CardExample />
              </CardList>
            </PanelBody>
          </Panel>
        </Dialog>
      )}
    </>
  )
}
