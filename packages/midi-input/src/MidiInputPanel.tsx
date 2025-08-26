import { useState } from 'react'
import { EnumOption, HedronEngine, Input } from '@hedron/engine'
import {
  Button,
  ControlGrid,
  EnumDropdown,
  NodeControl,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
} from '@hedron/ui-core'
import { midiMessageNames } from '@hedron/midi-manager'
import { MidiInput, MidiInputOptions } from './MidiInput'

interface IProps {
  input: Input<MidiInputOptions>
  // TODO: This can be typed as something like HedronEngineWithPlugin<MidiInput>
  engine: HedronEngine
}

const channelOptions: EnumOption[] = []
for (let i = 0; i <= 15; i++) {
  channelOptions.push({ label: `${i + 1}`, value: i })
}

const noteOptions: EnumOption[] = []
for (let i = 0; i < 127; i++) {
  noteOptions.push({ label: `${i + 1}`, value: i })
}

const messageTypeOptions = Object.entries(midiMessageNames).map(([key, niceName]) => ({
  label: niceName,
  value: key,
}))

const enumOptions = {
  channel: channelOptions,
  note: noteOptions,
  type: messageTypeOptions,
} as const

/**
 * A react component that displays the midi settings for a parameter
 */
export const MidiInputPanel = ({ input, engine }: IProps) => {
  const [isLearning, setIsLearning] = useState(false)

  // TODO: May not need this "as" if we have HedronEngineWithPlugin<MidiInput>
  const plugin = engine.plugins['midi-input'] as MidiInput
  const midiManager = plugin.midiManager

  const inputOptions = [
    ['channel', input.options.channel],
    ['note', input.options.note],
    ['type', input.options.type],
  ] as const

  return (
    <div>
      <ControlGrid className="mb-xl">
        {inputOptions.map(([key, value]) => (
          <NodeControl key={key}>
            <NodeControlMain>
              <NodeControlTitle>{key}</NodeControlTitle>
              <NodeControlInner>
                <EnumDropdown
                  value={value}
                  values={enumOptions[key]}
                  // onValueChange={(newVal) => {
                  //   // TODO: Hacky. Soon we'll use nodes for options so no need to fix this up
                  //   if (key !== 'type') {
                  //     newVal = parseInt(newVal as string)
                  //   }
                  //   engine
                  //     .getStore()
                  //     .getState()
                  //     .updateInputOptions(input.id, {
                  //       [key]: newVal,
                  //     })
                  // }}
                />
              </NodeControlInner>
            </NodeControlMain>
          </NodeControl>
        ))}
      </ControlGrid>

      {isLearning ? (
        <Button type="neutral" onClick={cancelMidiLearn}>
          Cancel
        </Button>
      ) : (
        <Button onClick={runMidiLearn}>Midi Learn</Button>
      )}
    </div>
  )

  async function runMidiLearn() {
    setIsLearning(true)
    midiManager
      .midiLearn()
      .then((event) => {
        if (!event) {
          setIsLearning(false)
          return
        }

        engine.getStore().getState().updateInputOptions(input.id, {
          channel: event.channel,
          note: event.note,
          type: event.type,
        })
      })
      .finally(() => {
        setIsLearning(false)
      })
  }

  function cancelMidiLearn() {
    midiManager.cancelMidiLearn()
  }

  // function removeMidi(id: string) {
  //   return () => {
  //     engine.deleteInputParam(id, param.id)
  //   }
  // }
}
