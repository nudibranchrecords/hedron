import type { Meta } from '@storybook/react'
import { fn } from '@storybook/test'
import {
  Card,
  CardActions,
  CardBody,
  CardContent,
  CardDetails,
  CardHeader,
} from '@components/core/Card/Card'
import { Button } from '@components/core/Button/Button'

const meta = {
  title: 'Card',
  component: Card,
  parameters: {},
} satisfies Meta<typeof Card>

export default meta

export const Everything = () => {
  return (
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
}

export const OnlyActions = () => {
  return (
    <Card>
      <CardActions>
        <Button onClick={fn()} iconName="content_copy">
          Copy Sketch
        </Button>
        <Button onClick={fn()} type="danger" iconName="delete">
          Delete Sketch
        </Button>
      </CardActions>
    </Card>
  )
}

export const LongText = () => {
  return (
    <Card>
      <CardContent>
        <CardHeader iconName="token">Sketch: Starfield</CardHeader>
        <CardBody>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem optio earum dolore unde
            ipsam, fugiat debitis explicabo aut ex culpa? Est non sint maiores velit quisquam
            doloremque dolor, quasi sapiente?
          </p>
        </CardBody>
      </CardContent>
      <CardActions>
        <Button onClick={fn()} iconName="add">
          Add To Scene
        </Button>
      </CardActions>
    </Card>
  )
}

export const ActionsColumn = () => {
  return (
    <Card>
      <CardContent>
        <CardHeader iconName="token">Sketch: Starfield</CardHeader>
        <CardBody>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem optio earum dolore unde
            ipsam, fugiat debitis explicabo aut ex culpa? Est non sint maiores velit quisquam
            doloremque dolor, quasi sapiente?
          </p>
        </CardBody>
      </CardContent>
      <CardActions column>
        <Button onClick={fn()} type="neutral" iconName="info">
          More Info
        </Button>
        <Button onClick={fn()} iconName="add">
          Add To Scene
        </Button>
      </CardActions>
    </Card>
  )
}

export const NoBody = () => {
  return (
    <Card>
      <CardContent>
        <CardHeader iconName="token">Sketch: Starfield</CardHeader>
      </CardContent>
      <CardActions>
        <Button onClick={fn()} iconName="add">
          Add To Scene
        </Button>
      </CardActions>
    </Card>
  )
}

export const ProjectFile = () => {
  return (
    <Card>
      <CardContent>
        <CardHeader iconName="description">Project: My Cool Project</CardHeader>
        <CardDetails>C://foo/bar/whatever/secretproject/project.json</CardDetails>
      </CardContent>
      <CardActions>
        <Button onClick={fn()} iconName="add">
          Add To Scene
        </Button>
      </CardActions>
    </Card>
  )
}
