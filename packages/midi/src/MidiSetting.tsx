import React, { useState } from 'react'
import { HedronEngine, Input, NodeTypes, ParamWithInfo, UseEngineStore } from '@hedron/engine'
import { Midi } from '.'

interface IProps {
  param: ParamWithInfo
  engine: HedronEngine
  useEngineStore: UseEngineStore
  midi: Midi
}

export function getMidiSetting(
  param: ParamWithInfo,
  engine: HedronEngine,
  useEngineStore: UseEngineStore,
  midi: Midi,
): JSX.Element {
  return <MidiSetting param={param} engine={engine} useEngineStore={useEngineStore} midi={midi} />
}

const useInputsWithNode = (nodeId: string, useEngineStore: UseEngineStore) => {
  const inputs = useEngineStore((state) => state.inputs)
  return Object.values(inputs).filter((input) => input.targetNodeIds.includes(nodeId))
}

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
