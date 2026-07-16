import type { Meta, StoryObj } from '@storybook/react'
import {
  ParamFavouritesControl,
  ParamFavouriteItem,
} from '../components/ParamFavouritesControl/ParamFavouritesControl'

const defaultFavourites: ParamFavouriteItem[] = [
  { id: 'favourite-1', name: 'Bright Pulse' },
  { id: 'favourite-2', name: 'Fog Drift' },
  { id: 'favourite-3', name: 'Soft Bloom' },
]

const meta: Meta<typeof ParamFavouritesControl> = {
  title: 'ParamFavourites/Control',
  component: ParamFavouritesControl,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '500px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    favourites: defaultFavourites,
    onFavouriteSelect: () => {},
    onFavouriteSave: () => {},
  },
}

export const Empty: Story = {
  args: {
    favourites: [],
    onFavouriteSelect: () => {},
    onFavouriteSave: () => {},
  },
}
