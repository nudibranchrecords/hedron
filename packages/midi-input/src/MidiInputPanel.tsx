import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { HedronEngine, Input, NodeTypes, ParamWithInfo, UseEngineStore } from '@hedron/engine'
import { Button } from '@hedron/ui-core'
import { Midi } from '@hedron/midi'

interface IProps {
  input: Input
}

// const getName = (input: Input): string => {
//   const [channel, note] = input.id.split('-')
//   return `Ch ${parseInt(channel) + 1} Note ${note}  `
// }

/**
 * A react component that displays the midi settings for a parameter
 */
export const MidiInputPanel = ({ input }: IProps) => {
  const [isLearning, setIsLearning] = useState(false)

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
