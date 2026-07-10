import { useCallback, useState, useMemo } from 'react'
import { findNodeWithKeyFromIdList, HedronEngine, InputNode } from '@hedron-gl/engine'
import { MIDIEvent, MidiManager } from '@hedron-gl/midi-manager'
import { Button, ControlGrid, NodeContainer, useEngineStore } from '@hedron-gl/ui-core'
import { MidiInput } from './MidiInput'

interface IProps {
  input: InputNode
  // TODO: This can be typed as something like HedronEngineWithPlugin<MidiInput>
  engine: HedronEngine
}

const useMidiLearn = (input: InputNode, engine: HedronEngine) => {
  const [isLearning, setIsLearning] = useState(false)

  // TODO: May not need this "as" if we have HedronEngineWithPlugin<MidiInput>
  const plugin = engine.plugins['midi-input'] as MidiInput
  const midiManager: MidiManager = plugin.midiManager

  const runMidiLearn = useCallback(async () => {
    setIsLearning(true)
    midiManager
      .midiLearn()
      .then((event: MIDIEvent | undefined) => {
        if (!event) {
          setIsLearning(false)
          return
        }

        const store = engine.getStore()
        const state = store.getState()

        // Update each option node with the learned values
        input.childGroups.optionNodeIds.forEach((nodeId) => {
          const node = state.nodes[nodeId]
          if (!node || node.nodeType !== 'param') return

          switch (node.key) {
            case 'channel':
              state.updateParamValue(nodeId, event.channel)
              break
            case 'note':
              state.updateParamValue(nodeId, event.note)
              break
            case 'type':
              state.updateParamValue(nodeId, event.type)
              break
          }
        })
      })
      .finally(() => {
        setIsLearning(false)
      })
  }, [engine, input.childGroups.optionNodeIds, midiManager])

  const cancelMidiLearn = useCallback(() => {
    midiManager.cancelMidiLearn()
  }, [midiManager])

  return {
    isLearning,
    runMidiLearn,
    cancelMidiLearn,
  }
}

/**
 * A react component that displays the midi settings for a parameter
 */
export const MidiInputPanel = ({ input, engine }: IProps) => {
  const { isLearning, runMidiLearn, cancelMidiLearn } = useMidiLearn(input, engine)
  const nodes = useEngineStore((s) => s.nodes)
  const paramValues = useEngineStore((s) => s.paramValues)

  const overrideNodeId = useMemo(
    () => findNodeWithKeyFromIdList(nodes, 'overrideValue', input.childGroups.optionNodeIds)?.id,
    [input.childGroups.optionNodeIds, nodes],
  )

  const overrideEnabled = overrideNodeId ? Boolean(paramValues[overrideNodeId]) : false

  return (
    <div>
      <ControlGrid className="mb-xl">
        {input.childGroups.optionNodeIds
          .filter((id) => {
            const node = nodes[id]
            if (!node || !('key' in node)) return false
            if (node.key === 'overrideValue') return overrideEnabled
            return true
          })
          .map((id) => (
            <NodeContainer key={id} nodeId={id} />
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
}
