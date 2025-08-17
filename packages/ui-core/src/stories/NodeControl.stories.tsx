import type { Meta } from '@storybook/react'
import { fn } from '@storybook/test'
import { useEffect, useRef, useState } from 'react'
import { useInterval } from 'usehooks-ts'
import { EnumDropdown, EnumDropdownHandle } from '@components/EnumDropdown/EnumDropdown'
import {
  NodeControl,
  NodeControlMain,
  NodeControlTitle,
  NodeControlInner,
} from '@components/NodeControl/NodeControl'

import { ControlGrid } from '@components/ControlGrid/ControlGrid'

import { FloatSlider, FloatSliderHandle } from '@components/FloatSlider/FloatSlider'
import { BooleanToggle, BooleanToggleHandle } from '@components/BooleanToggle/BooleanToggle'
import { ColorPickerHandle, ColorPicker } from '@components/ColorPicker/ColorPicker'
import { Panel, PanelBody, PanelHeader } from '@components/Panel/Panel'
import { NumberInput, NumberInputHandle } from '@components/NumberInput/NumberInput'
import { Button } from '@components/Button/Button'

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
  dev_autoUpdate?: boolean
}

export const Number = ({
  title = 'Short Name',
  isActive,
  onClick,
  dev_autoUpdate = true,
}: BasicProps) => {
  const ref = useRef<FloatSliderHandle>(null)

  useEffect(() => {
    ref.current?.updateValue(Math.random() * 1)
  }, [dev_autoUpdate])

  useInterval(() => {
    if (!dev_autoUpdate) return
    ref.current!.updateValue(Math.random() * 1)
  }, 3000)

  return (
    <NodeControl isActive={isActive} onClick={onClick}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <FloatSlider min={-1} max={1} onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const NumberMinMaxPositive = ({ title = 'Short Name', isActive, onClick }: BasicProps) => {
  const ref = useRef<FloatSliderHandle>(null)

  useEffect(() => {
    ref.current?.updateValue(Math.random() * 1)
  }, [])

  return (
    <NodeControl isActive={isActive} onClick={onClick}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <FloatSlider min={5} max={20} onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const NumberMinMaxNegative = ({ title = 'Short Name', isActive, onClick }: BasicProps) => {
  const ref = useRef<FloatSliderHandle>(null)

  useEffect(() => {
    ref.current?.updateValue(Math.random() * 1)
  }, [])

  return (
    <NodeControl isActive={isActive} onClick={onClick}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <FloatSlider min={-10} max={10} onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const NumberTextOnly = ({
  title = 'Short Name',
  isActive,
  onClick,
  dev_autoUpdate = true,
}: BasicProps) => {
  const ref = useRef<NumberInputHandle>(null)

  useEffect(() => {
    ref.current?.updateValue(Math.random() * 1)
  }, [])

  useInterval(() => {
    if (!dev_autoUpdate) return
    ref.current!.updateValue(Math.random() * 1)
  }, 3000)

  return (
    <NodeControl isActive={isActive} onClick={onClick}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <NumberInput onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const Boolean = ({
  title = 'Boolean Thing',
  isActive,
  onClick,
  dev_autoUpdate = true,
}: BasicProps) => {
  const ref = useRef<BooleanToggleHandle>(null)

  useInterval(() => {
    if (!dev_autoUpdate) return
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

export const Color = ({
  title = 'Color Picker',
  isActive,
  onClick,
  dev_autoUpdate = true,
}: BasicProps) => {
  const ref = useRef<ColorPickerHandle>(null)

  useInterval(() => {
    if (!dev_autoUpdate) return
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
  { value: 'option1', label: 'My Crazy Option' },
  { value: 'option2', label: 'My Extra Long Option Name That Might Break Things' },
  { value: 'option3', label: 'MyExtraLongOptionNameWithNoSpacesWow' },
]

export const Enum = ({
  title = 'Enum Dropdown',
  isActive,
  onClick,
  dev_autoUpdate,
}: BasicProps) => {
  const ref = useRef<EnumDropdownHandle>(null)

  useInterval(() => {
    if (!dev_autoUpdate) return
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
    <>
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
              <Color
                key={i}
                title={title}
                isActive={activeId === i}
                onClick={() => setActiveId(i)}
              />
            )}
            {type === 'enum' && (
              <Enum
                key={i}
                title={title}
                isActive={activeId === i}
                onClick={() => setActiveId(i)}
              />
            )}
          </>
        ))}
      </ControlGrid>
    </>
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

const lotsOfParams = [
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

export const PerfTest = () => {
  const [activeId, setActiveId] = useState(0)
  const [renderKey, setRenderKey] = useState(0)

  return (
    <>
      <Button onClick={() => setRenderKey((prev) => prev + 1)}>Force re-render</Button>
      <ControlGrid key={renderKey}>
        {lotsOfParams.map(([title, type], i) => (
          <>
            {type === 'number' && (
              <Number
                key={i}
                title={title}
                isActive={activeId === i}
                onClick={() => setActiveId(i)}
                dev_autoUpdate={false}
              />
            )}
            {type === 'boolean' && (
              <Boolean
                key={i}
                title={title}
                isActive={activeId === i}
                onClick={() => setActiveId(i)}
                dev_autoUpdate={false}
              />
            )}
            {type === 'color' && (
              <Color
                key={i}
                title={title}
                isActive={activeId === i}
                onClick={() => setActiveId(i)}
                dev_autoUpdate={false}
              />
            )}
            {type === 'enum' && (
              <Enum
                key={i}
                title={title}
                isActive={activeId === i}
                onClick={() => setActiveId(i)}
                dev_autoUpdate={false}
              />
            )}
          </>
        ))}
      </ControlGrid>
    </>
  )
}
