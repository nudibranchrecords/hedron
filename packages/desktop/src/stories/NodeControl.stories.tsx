import type { Meta } from '@storybook/react'
import { fn } from '@storybook/test'
import { useRef, useState } from 'react'
import { useInterval } from 'usehooks-ts'
import {
  NodeControl,
  NodeControlMain,
  NodeControlTitle,
  NodeControlInner,
} from '@components/core/NodeControl/NodeControl'

import { ControlGrid } from '@components/core/ControlGrid/ControlGrid'

import { FloatSlider, FloatSliderHandle } from '@components/core/FloatSlider/FloatSlider'
import { BooleanToggle, BooleanToggleHandle } from '@components/core/BooleanToggle/BooleanToggle'
import { ColorPickerHandle, ColorPicker } from '@components/core/ColorPicker/ColorPicker'
import { Panel, PanelBody, PanelHeader } from '@components/core/Panel/Panel'
import {
  EnumDropdown,
  EnumDropdownHandle,
} from '@renderer/components/core/EnumDropdown/EnumDropdown'

const meta = {
  title: 'NodeControl',
  component: NodeControl,
} satisfies Meta<typeof NodeControl>

export default meta

interface BasicProps {
  title: string
  isActive?: boolean
  color?: 'light'
  onClick: () => void
}

export const Number = ({ title = 'Short Name', isActive, onClick }: BasicProps) => {
  const ref = useRef<FloatSliderHandle>(null)

  useInterval(() => {
    ref.current!.drawBar(Math.random())
  }, 3000)
  return (
    <NodeControl isActive={isActive} onClick={onClick}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <FloatSlider onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const Boolean = ({ title = 'Boolean Thing', isActive, onClick }: BasicProps) => {
  const ref = useRef<BooleanToggleHandle>(null)

  useInterval(() => {
    ref.current!.setChecked(Math.random() > 0.5)
  }, 3000)
  return (
    <NodeControl isActive={isActive} onClick={onClick}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <BooleanToggle onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const Color = ({ title = 'Color Picker', isActive, onClick }: BasicProps) => {
  const ref = useRef<ColorPickerHandle>(null)

  useInterval(() => {
    ref.current!.updateColor([Math.random(), Math.random(), Math.random()])
  }, 3000)

  return (
    <NodeControl isActive={isActive} onClick={onClick}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <ColorPicker ref={ref} onValueChange={fn()} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

export const Enum = ({ title = 'Enum Dropdown', isActive, onClick }: BasicProps) => {
  const ref = useRef<EnumDropdownHandle>(null)

  useInterval(() => {
    ref.current!.setValue(options[Math.floor(Math.random() * options.length)].value)
  }, 3000)

  return (
    <NodeControl isActive={isActive} onClick={onClick}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <EnumDropdown ref={ref} onValueChange={fn()} values={options} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

const params = [
  ['Fun Param Name', 'number'],
  ['Another Param', 'boolean'],
  ['Color Picker', 'color'],
  ['Color Picker', 'color'],
  ['Slider', 'number'],
  ['Toggle', 'boolean'],
  ['Color Picker', 'color'],
  ['Slider', 'number'],
  ['Slider', 'number'],
  ['Toggle', 'boolean'],
  ['Color Picker', 'color'],
  ['Enum Dropdown', 'enum'],
]

export const WithControlGrid = () => {
  const [activeId, setActiveId] = useState(0)

  return (
    <ControlGrid>
      {params.map(([title, type], i) => (
        <>
          {type === 'number' && (
            <Number
              key={i}
              title={title}
              isActive={activeId === i}
              onClick={() => setActiveId(i)}
            />
          )}
          {type === 'boolean' && (
            <Boolean
              key={i}
              title={title}
              isActive={activeId === i}
              onClick={() => setActiveId(i)}
            />
          )}
          {type === 'color' && (
            <Color key={i} title={title} isActive={activeId === i} onClick={() => setActiveId(i)} />
          )}
          {type === 'enum' && (
            <Enum key={i} title={title} isActive={activeId === i} onClick={() => setActiveId(i)} />
          )}
        </>
      ))}
    </ControlGrid>
  )
}

export const GridOnPanel = () => (
  <Panel spacing="slim">
    <PanelHeader iconName="power">Foo Bar</PanelHeader>
    <PanelBody>
      <WithControlGrid />
    </PanelBody>
  </Panel>
)
