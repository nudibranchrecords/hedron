import type { Meta } from '@storybook/react'
import {
  NodeControl,
  NodeControlMain,
  NodeControlTitle,
  NodeControlInner,
} from '../renderer/components/core/NodeControl/NodeControl'

import { ControlGrid } from '../renderer/components/core/ControlGrid/ControlGrid'

import { fn } from '@storybook/test'

import { FloatSlider, FloatSliderHandle } from '../renderer/components/core/FloatSlider/FloatSlider'
import { useRef } from 'react'
import { useInterval } from 'usehooks-ts'

const meta = {
  title: 'NodeControl',
  component: NodeControl,
} satisfies Meta<typeof NodeControl>

export default meta

interface BasicProps {
  title: string
}

const Base = ({ title = 'Short Name' }: BasicProps) => {
  const ref = useRef<FloatSliderHandle>(null)

  useInterval(() => {
    ref.current!.drawBar(Math.random())
  }, 3000)
  return (
    <NodeControl>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <FloatSlider onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

const params = [
  'Velocity X',
  'Velocity Y',
  'Rotation Speed X',
  'Rotation Speed Y',
  'some long name x',
  'some other thing y',
  'short',
  'another long param',
]

export const WithControlGrid = () => (
  <ControlGrid>
    {params.map((item, i) => (
      <Base key={i} title={item} />
    ))}
  </ControlGrid>
)
