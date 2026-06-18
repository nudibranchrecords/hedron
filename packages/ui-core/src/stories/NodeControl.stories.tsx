import type { Meta } from '@storybook/react'
import { fn } from '@storybook/test'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useInterval } from 'usehooks-ts'
import { ParamFileValue } from '@hedron-gl/engine'
import { FilePicker } from '@components/FilePicker/FilePicker'
import { EnumDropdown, EnumDropdownHandle } from '@components/EnumDropdown/EnumDropdown'
import {
  NodeControl,
  NodeControlMain,
  NodeControlTitle,
  NodeControlInner,
  NodeControlInfo,
  NodeControlInputCount,
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
  onClick: () => void
}

export const Number = ({ title = 'Short Name', isActive, onClick }: BasicProps) => {
  const ref = useRef<FloatSliderHandle>(null)

  useEffect(() => {
    ref.current?.updateValue(Math.random())
  }, [])

  useInterval(() => {
    ref.current!.updateValue(Math.random())
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
    ref.current?.updateValue(Math.random())
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
    ref.current?.updateValue(Math.random())
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

export const NumberTextOnly = ({ title = 'Short Name', isActive, onClick }: BasicProps) => {
  const ref = useRef<NumberInputHandle>(null)

  useEffect(() => {
    ref.current?.updateValue(Math.random())
  }, [])

  useInterval(() => {
    ref.current!.updateValue(Math.random())
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
  { value: 'option1', label: 'My Crazy Option' },
  { value: 'option2', label: 'My Extra Long Option Name That Might Break Things' },
  { value: 'option3', label: 'MyExtraLongOptionNameWithNoSpacesWow' },
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

export const Trigger = ({ title = 'Trigger Pad', isActive, onClick }: BasicProps) => {
  const ref = useRef<TriggerPadHandle>(null)

  const onPadClick = () => {
    fn()
    ref.current?.blink()
  }

  useInterval(() => {
    ref.current!.blink()
  }, 3000)

  return (
    <NodeControl isActive={isActive} onClick={onClick}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <TriggerPad ref={ref} onMouseDown={onPadClick} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

const fileList = [
  { fileName: 'MyFile.png', contentType: 'image/png', lastModified: 0 },
  { fileName: 'cover-art.JPG', contentType: 'image/jpeg', lastModified: 0 },
  { fileName: 'Loop.WAV', contentType: 'audio/wav', lastModified: 0 },
  { fileName: 'MyFile.mp3', contentType: 'audio/mpeg', lastModified: 0 },
  { fileName: 'voice-note.m4a', contentType: 'audio/mp4', lastModified: 0 },
  { fileName: 'MyOtherFile.mp4', contentType: 'video/mp4', lastModified: 0 },
  { fileName: 'trailer.webm', contentType: 'video/webm', lastModified: 0 },
  { fileName: 'Patch.PDF', contentType: 'application/pdf', lastModified: 0 },
  { fileName: 'session.hedron', contentType: 'application/json', lastModified: 0 },
  { fileName: 'notes.txt', contentType: 'text/plain', lastModified: 0 },
]

interface FileStoryProps extends BasicProps {
  accept?: string[] | null
  startingFile?: ParamFileValue
}

const FileStory = ({
  title = 'File Picker',
  isActive,
  onClick,
  accept,
  startingFile,
}: FileStoryProps) => {
  const [file, setFile] = useState<ParamFileValue>(startingFile || null)

  return (
    <NodeControl isActive={isActive} onClick={onClick}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <FilePicker
            availableFiles={fileList}
            currentFileName={file}
            onFileNameChange={setFile}
            accept={accept}
          />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const File = ({ title = 'File Picker', isActive, onClick }: BasicProps) => {
  return <FileStory title={title} isActive={isActive} onClick={onClick} />
}

export const FileMissing = ({ title = 'Video Only', isActive, onClick }: BasicProps) => {
  return (
    <FileStory title={title} isActive={isActive} onClick={onClick} startingFile="missing.mp4" />
  )
}

export const FileImagesAndMp3 = ({ title = 'Images + MP3', isActive, onClick }: BasicProps) => {
  return (
    <FileStory title={title} isActive={isActive} onClick={onClick} accept={['image/*', '.mp3']} />
  )
}

export const FileAudioOnly = ({ title = 'Audio Only', isActive, onClick }: BasicProps) => {
  return (
    <FileStory
      title={title}
      isActive={isActive}
      onClick={onClick}
      accept={['audio/*']}
      startingFile="Loop.WAV"
    />
  )
}

export const FileExactMimeAndExtension = ({
  title = 'PDF + MP4',
  isActive,
  onClick,
}: BasicProps) => {
  return (
    <FileStory
      title={title}
      isActive={isActive}
      onClick={onClick}
      accept={['application/pdf', '.mp4']}
    />
  )
}

export const FileVideoOnly = ({ title = 'Video Only', isActive, onClick }: BasicProps) => {
  return <FileStory title={title} isActive={isActive} onClick={onClick} accept={['video/*']} />
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

export const WithControlGrid = () => {
  const [activeId, setActiveId] = useState(0)

  return (
    <ControlGrid>
      {params.map(([title, type], i) => (
        <Fragment key={i}>
          {type === 'number' && (
            <Number title={title} isActive={activeId === i} onClick={() => setActiveId(i)} />
          )}
          {type === 'boolean' && (
            <Boolean title={title} isActive={activeId === i} onClick={() => setActiveId(i)} />
          )}
          {type === 'color' && (
            <Color title={title} isActive={activeId === i} onClick={() => setActiveId(i)} />
          )}
          {type === 'enum' && (
            <Enum title={title} isActive={activeId === i} onClick={() => setActiveId(i)} />
          )}
          {type === 'trigger' && (
            <Trigger title={title} isActive={activeId === i} onClick={() => setActiveId(i)} />
          )}
        </Fragment>
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

export const NumberReversed = ({ title = 'Short Name', isActive, onClick }: BasicProps) => {
  const ref = useRef<FloatSliderHandle>(null)

  useEffect(() => {
    ref.current?.updateValue(Math.random())
  }, [])

  return (
    <NodeControl isActive={isActive} onClick={onClick}>
      <NodeControlMain>
        <NodeControlTitle>{title}</NodeControlTitle>
        <NodeControlInner>
          <FloatSlider min={10} max={-10} onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const NumberWithInputCount = ({ title = 'Brightness', isActive, onClick }: BasicProps) => {
  const ref = useRef<FloatSliderHandle>(null)

  useEffect(() => {
    ref.current?.updateValue(Math.random())
  }, [])

  return (
    <NodeControl isActive={isActive} onClick={onClick}>
      <NodeControlMain>
        <NodeControlInfo>
          <NodeControlTitle>{title}</NodeControlTitle>
          <NodeControlInputCount inputCount={2} />
        </NodeControlInfo>
        <NodeControlInner>
          <FloatSlider min={0} max={1} onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const BooleanWithInputCount = ({ title = 'Enabled', isActive, onClick }: BasicProps) => {
  const ref = useRef<BooleanToggleHandle>(null)

  return (
    <NodeControl isActive={isActive} onClick={onClick}>
      <NodeControlMain>
        <NodeControlInfo>
          <NodeControlTitle>{title}</NodeControlTitle>
          <NodeControlInputCount inputCount={1} />
        </NodeControlInfo>
        <NodeControlInner>
          <BooleanToggle onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const WithInputCountZero = ({ title = 'No Inputs', isActive, onClick }: BasicProps) => {
  const ref = useRef<FloatSliderHandle>(null)

  useEffect(() => {
    ref.current?.updateValue(0.5)
  }, [])

  return (
    <NodeControl isActive={isActive} onClick={onClick}>
      <NodeControlMain>
        <NodeControlInfo>
          <NodeControlTitle>{title}</NodeControlTitle>
          <NodeControlInputCount inputCount={0} />
        </NodeControlInfo>
        <NodeControlInner>
          <FloatSlider min={0} max={1} onValueChange={fn()} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}
