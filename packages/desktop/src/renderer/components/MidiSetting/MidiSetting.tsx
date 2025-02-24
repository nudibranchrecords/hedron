import { Input, NodeTypes, ParamWithInfo } from '@hedron/engine'
import { useInputsWithNode } from '@components/hooks/useInput'
import { engine } from '@renderer/engine'
import { useState } from 'react'

interface ParamMidiSetting {
  param: ParamWithInfo
}

export const MidiSetting = ({ param }: ParamMidiSetting) => {
  const inputs = useInputsWithNode(param.id)
  const [isLearning, setIsLearning] = useState(false)

  if (param.valueType !== NodeTypes.Number) {
    return null
  }

  async function useMidiLearn() {
    setIsLearning(true)
    engine.midiLearn(param.id)
      .finally(() => {
        setIsLearning(false)
      });
  }

  function cancelMidiLearn() {
    engine.cancelMidiLearn()
  }

  function removeMidi(id: string) {
    return () => {
      engine.deleteInputParam(id, param.id)
    }
  }

  function getName(input: Input): string {
    const [channel, note] = input.id.split('-')
    return `Ch ${parseInt(channel) + 1} Note ${note}  `
  }

  return (
    <>
      {inputs.map((input) => (
        <div key={input.id}>
          {getName(input)}
          <button onClick={removeMidi(input.id)}>Remove</button>
        </div>
      ))}
      <div>
        {isLearning ? (
          <button onClick={cancelMidiLearn}>Cancel</button>
        ) : (
          <button onClick={useMidiLearn}>Midi Learn</button>
        )}
      </div>
    </>
  )
}
