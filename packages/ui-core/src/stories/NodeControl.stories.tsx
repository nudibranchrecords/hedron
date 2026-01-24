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
import { TriggerPad, TriggerPadHandle } from '@components/TriggerPad/TriggerPad'
import { Panel, PanelBody, PanelHeader } from '@components/Panel/Panel'
import { NumberInput, NumberInputHandle } from '@components/NumberInput/NumberInput'

const meta = {
  title: 'NodeControl',
  component: NodeControl,
} satisfies Meta<typeof NodeControl>

export default meta

interface BasicProps {
  title: string
  isActive?: boolean
  color?: 'light'
  layout?: 'horizontal' | 'vertical'
  onClick: () => void
}

export const Number = ({ title = 'Short Name', isActive, layout, onClick }: BasicProps) => {
  const ref = useRef<FloatSliderHandle>(null)

  useEffect(() => {
    ref.current?.updateValue(Math.random() * 1)
  }, [])

  useInterval(() => {
    ref.current!.updateValue(Math.random() * 1)
  }, 3000)
  return (
    <NodeControl isActive={isActive} onClick={onClick} layout={layout}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <FloatSlider min={-1} max={1} onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const NumberVertical = ({ title = 'Short Name', isActive, onClick }: BasicProps) => {
  const ref = useRef<FloatSliderHandle>(null)

  useEffect(() => {
    ref.current?.updateValue(Math.random() * 1)
  }, [])

  useInterval(() => {
    ref.current!.updateValue(Math.random() * 1)
  }, 3000)
  return (
    <NodeControl isActive={isActive} onClick={onClick} layout="vertical">
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <FloatSlider min={-1} max={1} onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const NumberMinMaxPositive = ({
  title = 'Short Name',
  isActive,
  layout,
  onClick,
}: BasicProps) => {
  const ref = useRef<FloatSliderHandle>(null)

  useEffect(() => {
    ref.current?.updateValue(Math.random() * 1)
  }, [])

  return (
    <NodeControl isActive={isActive} onClick={onClick} layout={layout}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <FloatSlider min={5} max={20} onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
      ,
    </NodeControl>
  )
}

export const NumberMinMaxNegative = ({
  title = 'Short Name',
  isActive,
  layout,
  onClick,
}: BasicProps) => {
  const ref = useRef<FloatSliderHandle>(null)

  useEffect(() => {
    ref.current?.updateValue(Math.random() * 1)
  }, [])

  return (
    <NodeControl isActive={isActive} onClick={onClick} layout={layout}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <FloatSlider min={-10} max={10} onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const NumberTextOnly = ({ title = 'Short Name', isActive, layout, onClick }: BasicProps) => {
  const ref = useRef<NumberInputHandle>(null)

  useEffect(() => {
    ref.current?.updateValue(Math.random() * 1)
  }, [])

  useInterval(() => {
    ref.current!.updateValue(Math.random() * 1)
  }, 3000)

  return (
    <NodeControl isActive={isActive} onClick={onClick} layout={layout}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <NumberInput onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const Boolean = ({ title = 'Boolean Thing', isActive, layout, onClick }: BasicProps) => {
  const ref = useRef<BooleanToggleHandle>(null)

  useInterval(() => {
    ref.current!.setChecked(Math.random() > 0.5)
  }, 3000)
  return (
    <NodeControl isActive={isActive} onClick={onClick} layout={layout}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <BooleanToggle onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const Color = ({ title = 'Color Picker', isActive, layout, onClick }: BasicProps) => {
  const ref = useRef<ColorPickerHandle>(null)

  useInterval(() => {
    ref.current!.updateColor([Math.random(), Math.random(), Math.random()])
  }, 3000)

  return (
    <NodeControl isActive={isActive} onClick={onClick} layout={layout}>
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

export const Enum = ({ title = 'Enum Dropdown', isActive, layout, onClick }: BasicProps) => {
  const ref = useRef<EnumDropdownHandle>(null)

  useInterval(() => {
    ref.current!.setValue(options[Math.floor(Math.random() * options.length)].value)
  }, 3000)

  return (
    <NodeControl isActive={isActive} onClick={onClick} layout={layout}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <EnumDropdown ref={ref} onValueChange={fn()} values={options} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const Trigger = ({ title = 'Trigger Pad', isActive, layout, onClick }: BasicProps) => {
  const ref = useRef<TriggerPadHandle>(null)

  const onPadClick = () => {
    fn()
    ref.current?.blink()
  }

  useInterval(() => {
    ref.current!.blink()
  }, 3000)

  return (
    <NodeControl isActive={isActive} onClick={onClick} layout={layout}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <TriggerPad ref={ref} onMouseDown={onPadClick} />
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
  ['Trigger Pad', 'trigger'],
]

interface ControlGridStoryProps {
  layout?: 'horizontal' | 'vertical'
}

export const WithControlGrid = ({ layout }: ControlGridStoryProps) => {
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
              layout={layout}
              onClick={() => setActiveId(i)}
            />
          )}
          {type === 'boolean' && (
            <Boolean
              key={i}
              title={title}
              isActive={activeId === i}
              layout={layout}
              onClick={() => setActiveId(i)}
            />
          )}
          {type === 'color' && (
            <Color
              key={i}
              title={title}
              isActive={activeId === i}
              layout={layout}
              onClick={() => setActiveId(i)}
            />
          )}
          {type === 'enum' && (
            <Enum
              key={i}
              title={title}
              isActive={activeId === i}
              layout={layout}
              onClick={() => setActiveId(i)}
            />
          )}
          {type === 'trigger' && (
            <Trigger
              key={i}
              title={title}
              isActive={activeId === i}
              layout={layout}
              onClick={() => setActiveId(i)}
            />
          )}
        </>
      ))}
    </ControlGrid>
  )
}

export const WithControlGridVertical = () => <WithControlGrid layout="vertical" />

export const GridOnPanel = () => (
  <Panel spacing="slim">
    <PanelHeader iconName="power">Foo Bar</PanelHeader>
    <PanelBody>
      <WithControlGrid />
    </PanelBody>
  </Panel>
)
