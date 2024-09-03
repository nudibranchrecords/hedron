import type { Preview } from '@storybook/react'
import '../src/renderer/css/reset.css'
import '../src/renderer/css/variables.css'

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
          value: '#141515',
        },
      ],
    },
  },
}

export default preview
