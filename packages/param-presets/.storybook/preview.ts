import type { Preview } from '@storybook/react'

import '@hedron-gl/ui-core/base.css'
import '@hedron-gl/ui-core/icons.css'
import '@hedron-gl/ui-core/fonts.css'
import '@hedron-gl/ui-core/modules.css'

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
      defaultViewport: 'responsive',
    },
  },
}

export default preview
