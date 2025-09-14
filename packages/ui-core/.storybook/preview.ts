import type { Preview } from '@storybook/react'

import '../src/css/icons.css'
import '../src/css/fonts.css'
import '../src/css/base.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#333',
        },
      ],
    },
    viewport: {
      defaultViewport: 'responsive', // Set the global default viewport
    },
  },
}

export default preview
