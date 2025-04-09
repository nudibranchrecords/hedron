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

type Entries<T> = {
  [K in keyof T]-?: [K, T[K]]
}[keyof T][]
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
}

/**
 * A react component that displays the midi settings for a parameter
 */
export const MidiInputPanel = ({ input, engine }: IProps) => {
  const [isLearning, setIsLearning] = useState(false)

  // TODO: May not need this "as" if we have HedronEngineWithPlugin<MidiInput>
  const plugin = engine.plugins['midi-input'] as MidiInput
  const midiManager = plugin.midiManager

  // TODO: Move this into a helper function with the typing etc
  const inputOptions: [keyof MidiInputOptions, number | string][] = Object.entries(
    input.options,
  ) as Entries<MidiInputOptions>

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
                  onValueChange={(newVal) => {
                    // TODO: Hacky. Soon we'll use nodes for options so no need to fix this up
                    if (key !== 'type') {
                      newVal = parseInt(newVal as string)
                    }
                    engine
                      .getStore()
                      .getState()
                      .updateInputOptions(input.id, {
                        [key]: newVal,
                      })
                  }}
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
