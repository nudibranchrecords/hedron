import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { HedronEngine, Input, NodeTypes, ParamWithInfo, UseEngineStore } from '@hedron/engine'
import { Midi } from '.'

interface IProps {
  param: ParamWithInfo
  engine: HedronEngine
  useEngineStore: UseEngineStore
  midi: Midi
}

/**
 * Get the MIDI setting jsx element
 * @param param The parameter to display the midi setting for
 * @param engine hedron engine
 * @param useEngineStore useEngineStore hook
 * @param midi midi plugin
 * @returns A JSX Elelemnt that displays connected midi inputs, and allows for midi learning
 */
export function getMidiSetting(
  param: ParamWithInfo,
  engine: HedronEngine,
  useEngineStore: UseEngineStore,
  midi: Midi,
): JSX.Element {
  return <MidiSetting param={param} engine={engine} useEngineStore={useEngineStore} midi={midi} />
}

/**
 * Get the inputs that are connected to the node
 * @param nodeId The node id to get the inputs for
 * @param useEngineStore useEngineStore hook
 * @returns The inputs that are connected to the node
 */
const useInputsWithNode = (nodeId: string, useEngineStore: UseEngineStore) => {
  return useEngineStore(
    useShallow((state) =>
      Object.values(state.inputs).filter((input) => input.targetNodeIds.includes(nodeId)),
    ),
  )
}

/**
 * A react component that displays the midi settings for a parameter
 */
export const MidiSetting = ({ param, engine, useEngineStore, midi }: IProps) => {
  const inputs = useInputsWithNode(param.id, useEngineStore)
  const [isLearning, setIsLearning] = useState(false)

  if (param.valueType !== NodeTypes.Number) {
    return null
  }

  return (
    <div>
      <h1>Midi Settings</h1>
      {isLearning ? (
        <button onClick={cancelMidiLearn}>Cancel</button>
      ) : (
        <button onClick={runMidiLearn}>Midi Learn</button>
      )}
      <h3>Inputs:</h3>
      {inputs.map((input) => (
        <div key={input.id}>
          <button onClick={removeMidi(input.id)}>Remove</button>
          {`\t${getName(input)}`}
        </div>
      ))}
    </div>
  )

  async function runMidiLearn() {
    setIsLearning(true)
    midi.midiLearn(param.id).finally(() => {
      setIsLearning(false)
    })
  }

  function cancelMidiLearn() {
    midi.cancelMidiLearn()
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
}
