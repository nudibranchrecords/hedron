import React, { useState, useEffect } from 'react'
import { findNodeWithKeyFromIdList, HedronEngine, Param, Shot } from '@hedron-gl/engine'
import {
  Panel,
  PanelHeader,
  PanelBody,
  useEngineStore,
  ControlGrid,
  NodeContainer,
} from '@hedron-gl/ui-core'
import { MIDIEvent, MidiMessageType, midiMessageNames } from '@hedron-gl/midi-manager'
import { MidiInput } from './MidiInput'
import styles from './MidiGlobalPanel.module.css'

interface MidiGlobalPanelProps {
  engine: HedronEngine
}

interface MidiLogMessage {
  timestamp: number
  deviceName: string
  channel: number
  type: MidiMessageType
  note: number
  value?: number
  affectedNodeName?: string
  sketchName?: string
}

export const MidiGlobalPanel: React.FC<MidiGlobalPanelProps> = ({ engine }) => {
  const midiPlugin = engine.plugins['midi-input'] as MidiInput
  const [midiLog, setMidiLog] = useState<MidiLogMessage[]>([])
  const [connectedDevices, setConnectedDevices] = useState<string[]>([])

  const nodes = useEngineStore((state) => state.nodes)
  const nodeValues = useEngineStore((state) => state.nodeValues)
  const sketches = useEngineStore((state) => state.sketches)

  // Track connected devices
  useEffect(() => {
    if (!midiPlugin) return

    const updateDevices = () => {
      const deviceNames = midiPlugin.midiManager.inputDevices.map(
        (device) => device.name || 'Unknown Device',
      )
      setConnectedDevices(deviceNames)
    }

    updateDevices()
    midiPlugin.midiManager.onDeviceChange.add(updateDevices)

    return () => {
      midiPlugin.midiManager.onDeviceChange.remove(updateDevices)
    }
  }, [midiPlugin])

  // Track MIDI messages (only CC and Note messages)
  useEffect(() => {
    if (!midiPlugin) return

    const handleMidiMessage = (event: MIDIEvent) => {
      // Only log CC, Note On, and Note Off messages
      if (
        event.type !== MidiMessageType.ControlChange &&
        event.type !== MidiMessageType.NoteOn &&
        event.type !== MidiMessageType.NoteOff
      ) {
        return
      }

      // Find which node this affects
      let affectedNodeName: string | undefined
      let sketchName: string | undefined

      // TODO: Like all other inputs, this strategy of looping through all inputs is very inefficient (could have 1000s of nodes in a project)
      Object.values(nodes).forEach((input) => {
        if (input?.nodeType !== 'input' || input.inputType !== 'midi') return

        const channelNode = findNodeWithKeyFromIdList(nodes, 'channel', input.optionNodeIds)
        const noteNode = findNodeWithKeyFromIdList(nodes, 'note', input.optionNodeIds)
        const typeNode = findNodeWithKeyFromIdList(nodes, 'type', input.optionNodeIds)

        if (!channelNode || !noteNode || !typeNode) return

        const channelValue = nodeValues[channelNode.id]
        const noteValue = nodeValues[noteNode.id]
        const typeValue = nodeValues[typeNode.id]

        if (
          channelValue === event.channel &&
          noteValue === event.note &&
          typeValue === event.type
        ) {
          const targetNode = nodes[input.targetNodeId] as Param | Shot
          if (targetNode) {
            affectedNodeName = targetNode.title || targetNode.key

            // Find the sketch this node belongs to
            for (const sketch of Object.values(sketches)) {
              if (sketch.nodeIds.includes(input.targetNodeId)) {
                sketchName = sketch.title
                break
              }
            }
          }
        }
      })

      const logMessage: MidiLogMessage = {
        timestamp: Date.now(),
        deviceName: event.device.name || 'Unknown',
        channel: event.channel,
        type: event.type,
        note: event.note,
        value: event.value,
        affectedNodeName,
        sketchName,
      }

      setMidiLog((prev) => [logMessage, ...prev].slice(0, 50))
    }

    midiPlugin.midiManager.onMidiMessage.add(handleMidiMessage)

    return () => {
      midiPlugin.midiManager.onMidiMessage.remove(handleMidiMessage)
    }
  }, [midiPlugin, nodes, nodeValues, sketches])

  const globalNodeId = `${midiPlugin.id}-global`

  return (
    <Panel>
      <PanelHeader>MIDI Settings</PanelHeader>
      <PanelBody>
        <ControlGrid>
          <NodeContainer nodeId={`${globalNodeId}-smoothing`} />
        </ControlGrid>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Message Log</h3>
          {midiLog.length === 0 ? (
            <div className={styles.emptyMessage}>No messages received</div>
          ) : (
            <div className={styles.logContainer}>
              {midiLog.map((msg, index) => (
                <div key={index} className={styles.logMessage}>
                  <span className={styles.timestamp}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    className={msg.affectedNodeName ? styles.affectedNode : styles.unmappedNode}
                  >
                    {msg.affectedNodeName
                      ? `${msg.sketchName} - ${msg.affectedNodeName}`
                      : 'No Mapping'}
                  </span>
                  <span className={styles.details}>
                    Ch:{msg.channel + 1} Note:{msg.note}
                    {msg.value !== undefined && ` Val:${msg.value}`}
                  </span>
                  <span className={styles.type}>{midiMessageNames[msg.type]}</span>
                  <span className={styles.device}>{msg.deviceName}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Connected Devices</h3>
          {connectedDevices.length === 0 ? (
            <div className={styles.emptyMessage}>No MIDI devices connected</div>
          ) : (
            <div className={styles.deviceList}>
              {connectedDevices.map((deviceName, index) => (
                <div key={index} className={styles.deviceItem}>
                  {deviceName}
                </div>
              ))}
            </div>
          )}
        </div>
      </PanelBody>
    </Panel>
  )
}
