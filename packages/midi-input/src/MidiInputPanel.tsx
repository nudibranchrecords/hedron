import { useCallback, useState, useEffect, useMemo } from 'react'
import { HedronEngine, InputNode, ParamNode } from '@hedron-gl/engine'
import { MidiManager } from '@hedron-gl/midi-manager'
import {
  Button,
  ControlGrid,
  NodeContainer,
  useNodeOptionNodes,
  useParamValue,
} from '@hedron-gl/ui-core'
import { MidiInput } from './MidiInput'

import { MIDI_INPUT_TYPE_NOTE } from './constants'

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
    plugin.applyLearnedEvent(engine, input.id, event)
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

  const optionNodes = useNodeOptionNodes(input.id)

  const overrideNode = optionNodes.override
  const typeNode = optionNodes.type

  const overrideEnabled = useParamValue<boolean>(overrideNode?.id, false)
  const nodeType = useParamValue<number>(typeNode?.id, 0)
  const isNoteType = nodeType === MIDI_INPUT_TYPE_NOTE

  const filteredNodes = useMemo(() => {
    return Object.values(optionNodes).filter((node) => {
      if (!node || !('key' in node)) return false
      if (node.key === 'overrideValue') return overrideEnabled
      if (node.key === 'noteMode') return isNoteType
      return true
    }) as ParamNode[]
  }, [optionNodes, overrideEnabled, isNoteType])

  return (
    <div>
      <ControlGrid className="mb-xl">
        {filteredNodes.map((node) => (
          <NodeContainer key={node.id} nodeId={node.id} />
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
