import type { Meta } from '@storybook/react'
import { Card, CardActions, CardBody, CardHeader } from '../renderer/components/core/Card/Card'
import { fn } from '@storybook/test'
import { Button } from '../renderer/components/core/Button/Button'

const meta = {
  title: 'Card',
  component: Card,
  parameters: {},
} satisfies Meta<typeof Card>

export default meta

export const WithActions = () => {
  return (
    <Card>
      <CardHeader iconName="token">Sketch: Starfield</CardHeader>
      <CardBody>
        <p>Some stars fly through the scene.</p>
      </CardBody>
      <CardActions>
        <Button onClick={fn()} iconName="add">
          Add To Scene
        </Button>
      </CardActions>
    </Card>
  )
}

export const LongText = () => {
  return (
    <Card>
      <CardHeader iconName="token">Sketch: Starfield</CardHeader>
      <CardBody>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem optio earum dolore unde
          ipsam, fugiat debitis explicabo aut ex culpa? Est non sint maiores velit quisquam
          doloremque dolor, quasi sapiente?
        </p>
      </CardBody>
      <CardActions>
        <Button onClick={fn()} iconName="add">
          Add To Scene
        </Button>
      </CardActions>
    </Card>
  )
}
