import { useState } from 'react'
import { EnumOption, HedronEngine, Input } from '@hedron/engine'
import { Button, EnumDropdown } from '@hedron/ui-core'
import { MidiInput, MidiInputOptions } from './MidiInput'

interface IProps {
  input: Input<MidiInputOptions>
  // TODO: This can be typed as something like HedronEngineWithPlugin<MidiInput>
  engine: HedronEngine
}

const channelOptions: EnumOption[] = []
for (let i = 0; i <= 15; i++) {
  channelOptions.push({ label: `Channel ${i}`, value: i })
}

const noteOptions: EnumOption[] = []
for (let i = 0; i < 128; i++) {
  noteOptions.push({ label: `Note ${i}`, value: i })
}

/**
 * A react component that displays the midi settings for a parameter
 */
export const MidiInputPanel = ({ input, engine }: IProps) => {
  const [isLearning, setIsLearning] = useState(false)

  // TODO: May not need this "as" if we have HedronEngineWithPlugin<MidiInput>
  const plugin = engine.plugins['midi-input'] as MidiInput
  const midi = plugin.midiManager

  return (
    <div>
      <div>
        <strong>Channel:</strong>
        {input.options.channel}
        <EnumDropdown
          value={input.options.channel}
          values={channelOptions}
          onValueChange={(val) => {
            engine.getStore().getState().updateInputOptions(input.id, {
              channel: val,
            })
          }}
        />
      </div>
      <div>
        <strong>Note:</strong> {input.options.note}
        <EnumDropdown
          value={input.options.note}
          values={noteOptions}
          onValueChange={(val) => {
            engine.getStore().getState().updateInputOptions(input.id, {
              note: val,
            })
          }}
        />
      </div>
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
    midi
      .midiLearn()
      .then((event) => {
        if (!event) {
          setIsLearning(false)
          return
        }

        engine.getStore().getState().updateInputOptions(input.id, {
          channel: event.channel,
          note: event.note,
        })
      })
      .finally(() => {
        setIsLearning(false)
      })
  }

  function cancelMidiLearn() {
    midi.cancelMidiLearn()
  }

  // function removeMidi(id: string) {
  //   return () => {
  //     engine.deleteInputParam(id, param.id)
  //   }
  // }
}
