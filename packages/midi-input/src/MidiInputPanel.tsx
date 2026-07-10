import { useCallback, useState, useEffect, useMemo } from 'react'
import { findNodeWithKeyFromIdList, HedronEngine, InputNode } from '@hedron-gl/engine'
import { MidiManager } from '@hedron-gl/midi-manager'
import { Button, ControlGrid, NodeContainer, useEngineStore } from '@hedron-gl/ui-core'
import { MidiInput, NOTE_ON_OFF_MODE } from './MidiInput'

interface IProps {
  input: InputNode
  // TODO: This can be typed as something like HedronEngineWithPlugin<MidiInput>
  engine: HedronEngine
}

const useMidiLearn = (input: InputNode, engine: HedronEngine) => {
  // TODO: May not need this "as" if we have HedronEngineWithPlugin<MidiInput>
  const plugin = engine.plugins['midi-input'] as MidiInput
  const midiManager: MidiManager = plugin.midiManager

  // Reflects the manager's real state — a session may already be running before mount.
  const [isLearning, setIsLearning] = useState(midiManager.isLearning)

  useEffect(() => {
    setIsLearning(midiManager.isLearning)
    midiManager.onLearnStateChange.add(setIsLearning)
    return () => {
      midiManager.onLearnStateChange.remove(setIsLearning)
    }
  }, [midiManager])

  const runMidiLearn = useCallback(async () => {
    const event = await midiManager.midiLearn()
    if (!event) return
    // Re-learning an existing input shouldn't clobber a deliberately chosen type.
    plugin.applyLearnedEvent(engine, input.id, event, { includeType: false })
  }, [engine, input.id, midiManager, plugin])

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

  const typeNode = useMemo(
    () => findNodeWithKeyFromIdList(nodes, 'type', input.childGroups.optionNodeIds),
    [input.childGroups.optionNodeIds, nodes],
  )
  const isNoteOnOffMode = typeNode ? paramValues[typeNode.id] === NOTE_ON_OFF_MODE : false

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
