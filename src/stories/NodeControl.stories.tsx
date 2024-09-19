import type { Meta } from '@storybook/react'
import {
  NodeControl,
  NodeControlMain,
  NodeControlTitle,
  NodeControlInner,
} from '../renderer/components/core/NodeControl/NodeControl'

import { fn } from '@storybook/test'

import { FloatSlider, FloatSliderHandle } from '../renderer/components/core/FloatSlider/FloatSlider'
import { useRef } from 'react'
import { useInterval } from 'usehooks-ts'

const meta = {
  title: 'NodeControl',
  component: NodeControl,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '15rem', padding: '2em', backgroundColor: 'var(--bgColorDark1)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NodeControl>

export default meta

export const FloatSliderInner = () => {
  const ref = useRef<FloatSliderHandle>(null)

  useInterval(() => {
    ref.current!.drawBar(Math.random())
  }, 3000)
  return (
    <NodeControl>
      <NodeControlMain>
        <NodeControlTitle>Short Name</NodeControlTitle>
        <NodeControlInner>
          <FloatSlider onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const LongName = () => {
  const ref = useRef<FloatSliderHandle>(null)

  useInterval(() => {
    ref.current!.drawBar(Math.random())
  }, 3000)
  return (
    <NodeControl>
      <NodeControlMain>
        <NodeControlTitle>My Cool ParamLongName X</NodeControlTitle>
        <NodeControlInner>
          <FloatSlider onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}
