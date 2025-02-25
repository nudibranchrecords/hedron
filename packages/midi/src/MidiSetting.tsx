import React, { useState } from 'react'
import { EngineStateWithActions, HedronEngine, Input, NodeTypes, ParamWithInfo, UseEngineStore } from '@hedron/engine'

interface IProps {
    param: ParamWithInfo
    engine: HedronEngine
    useEngineStore: UseEngineStore
}

export function getMidiSetting(param: ParamWithInfo, engine: HedronEngine, useEngineStore: UseEngineStore): JSX.Element {
    return <MidiSetting param={param} engine={engine} useEngineStore={useEngineStore} />
}

const useInputsWithNode = (nodeId: string, useEngineStore: UseEngineStore) => {
    const inputs = useEngineStore((state) => state.inputs)
    return Object.values(inputs).filter((input) => input.targetNodeIds.includes(nodeId))
}

export const MidiSetting = ({ param, engine, useEngineStore }: IProps) => {

    // console.log('MidiSetting');
    // console.log(useEngineStore);
    const inputs = useInputsWithNode(param.id, useEngineStore)
    const [isLearning, setIsLearning] = useState(false)

    if (param.valueType !== NodeTypes.Number) {
        return null
    }
    return (
        <div>
            <h1>MidiSetting</h1>
        </div>
    )

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

}
