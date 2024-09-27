import type { Preview } from '@storybook/react'
import '../src/renderer/css/base.css'

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
  },
}

export default preview
