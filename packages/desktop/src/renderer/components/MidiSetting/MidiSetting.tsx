import { NodeTypes, ParamWithInfo } from '@hedron/engine'
import { useInputsWithNode } from '@components/hooks/useInput'
import { engine } from '@renderer/engine'

interface ParamMidiSetting {
  param: ParamWithInfo
}

export const MidiSetting = ({ param }: ParamMidiSetting) => {
  const inputs = useInputsWithNode(param.id)
  if (param.valueType !== NodeTypes.Number) {
    return
  }

  async function useMidiLearn() {
    await engine.midiLearn(param.id)
  }

  function removeMidi(id: string) {
    return () => {
      engine.deleteInputParam(id, param.id)
    }
  }

  return (
    <>
      {param.id} - {param.valueType}
      {inputs.map((input) => (
        <div key={input.id}>
          {input.id} - {input.type}
          <button onClick={removeMidi(input.id)}>Remove</button>
        </div>
      ))}
      <div>
        <button onClick={useMidiLearn}>Midi Learn</button>
      </div>
    </>
  )
}
