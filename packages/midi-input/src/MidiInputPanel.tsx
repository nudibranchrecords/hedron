import { useCallback, useState, useMemo, useEffect } from 'react'
import { findNodeWithKeyFromIdList, HedronEngine, InputNode } from '@hedron-gl/engine'
import { MIDIEvent, MidiManager, MidiMessageType } from '@hedron-gl/midi-manager'
import { Button, ControlGrid, NodeContainer, useEngineStore } from '@hedron-gl/ui-core'
import { MidiInput, NOTE_ON_OFF_MODE } from './MidiInput'

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

  // Check if auto MIDI learn is enabled
  const autoMidiLearnEnabled = Boolean(paramValues['midi-input-global-autoMidiLearn'])

  // Check if this is a brand new input (channel=1, note=1, type=ControlChange are defaults)
  const channelNode = useMemo(
    () => findNodeWithKeyFromIdList(nodes, 'channel', input.childGroups.optionNodeIds),
    [input.childGroups.optionNodeIds, nodes],
  )
  const noteNode = useMemo(
    () => findNodeWithKeyFromIdList(nodes, 'note', input.childGroups.optionNodeIds),
    [input.childGroups.optionNodeIds, nodes],
  )

  const isNewInput = useMemo(() => {
    if (!channelNode || !noteNode) return false
    const channel = paramValues[channelNode.id]
    const note = paramValues[noteNode.id]
    // Default values are: channel=1, note=1
    return channel === 1 && note === 1
  }, [channelNode, noteNode, paramValues])

  const typeNode = useMemo(
    () => findNodeWithKeyFromIdList(nodes, 'type', input.childGroups.optionNodeIds),
    [input.childGroups.optionNodeIds, nodes],
  )
  const isNoteOnOffMode = typeNode ? paramValues[typeNode.id] === NOTE_ON_OFF_MODE : false

  // Default boolean inputs to Note On/Off mode
  useEffect(() => {
    const store = engine.getStore()
    const state = store.getState()
    const targetNode = state.nodes[input.targetNodeId]
    if (!typeNode || !targetNode || !('valueType' in targetNode)) return
    if (
      targetNode.valueType === 'boolean' &&
      state.paramValues[typeNode.id] === MidiMessageType.ControlChange
    ) {
      state.updateParamValue(typeNode.id, NOTE_ON_OFF_MODE)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-enter MIDI learn mode when component mounts (if enabled and input is new)
  useEffect(() => {
    if (autoMidiLearnEnabled && isNewInput) {
      runMidiLearn()
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

      {isNoteOnOffMode && (
        <p className="mb-xl" style={{ opacity: 0.6, fontSize: '0.85em' }}>
          Note On/Off: press drives value up, release drives it to zero.
        </p>
      )}

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
