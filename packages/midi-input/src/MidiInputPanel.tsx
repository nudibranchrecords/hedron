import { useState } from 'react'
import { HedronEngine, Input } from '@hedron/engine'
import { Button } from '@hedron/ui-core'
import { MidiInput } from './MidiInput'

interface IProps {
  // TODO: This can be typed as something like Input<MidiInput>
  input: Input
  // TODO: This can be typed as something like HedronEngineWithPlugin<MidiInput>
  engine: HedronEngine
}

// const getName = (input: Input): string => {
//   const [channel, note] = input.id.split('-')
//   return `Ch ${parseInt(channel) + 1} Note ${note}  `
// }

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
      <h1>{input.id}</h1>
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
        console.log(event)
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
