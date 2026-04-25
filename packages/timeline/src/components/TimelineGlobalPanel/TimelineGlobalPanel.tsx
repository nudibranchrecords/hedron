import React, { useCallback } from 'react'
import { EngineStateWithActions, HedronEngine } from '@hedron-gl/engine'
import {
  Panel,
  PanelHeader,
  PanelBody,
  NodeContainer,
  useEngineStore,
  useEngineStoreWithContext,
} from '@hedron-gl/ui-core'
import { useTimelineData } from './useTimelineData'
import { useTimelineManager } from './useTimelineManager'
import { Timeline } from '@/components/Timeline/Timeline'
import type { TimelineTrackNode } from '@/types'

const TIMELINE_NODE_ID = 'timeline-input-default-timeline'
const IS_PLAYING_NODE_ID = `${TIMELINE_NODE_ID}-option-isPlaying`
const PLAYHEAD_POSITION_NODE_ID = `${TIMELINE_NODE_ID}-option-playheadPosition`

interface TimelineGlobalPanelProps {
  engine: HedronEngine
}

export const TimelineGlobalPanel: React.FC<TimelineGlobalPanelProps> = () => {
  const timeline = useTimelineData()
  const manager = useTimelineManager(timeline)
  const engineStore = useEngineStoreWithContext()
  const updateNodeValue = useEngineStore((state) => state.updateNodeValue)
  const playheadPosition = useEngineStore(
    (state) => state.nodeValues[PLAYHEAD_POSITION_NODE_ID] as number | undefined,
  )

  const handlePlayheadChange = useCallback(
    (time: number) => {
      updateNodeValue(PLAYHEAD_POSITION_NODE_ID, time)
      manager.goTo(time)
    },
    [manager, updateNodeValue],
  )

  const handleKeyframeDelete = useCallback(
    (keyframeId: string) => {
      engineStore.setState((state: EngineStateWithActions) => {
        for (const track of timeline.tracks) {
          const trackNodeId = `${track.id}-option-timeline-track`
          const trackNode = state.nodes[trackNodeId] as TimelineTrackNode | undefined
          if (!trackNode) continue

          const nextKeyframes = trackNode.customData.keyframes.filter((kf) => kf.id !== keyframeId)
          if (nextKeyframes.length === trackNode.customData.keyframes.length) continue

          trackNode.customData.keyframes = nextKeyframes
          return
        }
      })
    },
    [engineStore, timeline.tracks],
  )

  const handleKeyframeInsert = useCallback(
    (trackId: string, time: number) => {
      engineStore.setState((state: EngineStateWithActions) => {
        // TODO: This should just be the input node with customData.keyframes
        const trackNode = state.nodes[`${trackId}-option-timeline-track`] as
          | TimelineTrackNode
          | undefined

        if (!trackNode) {
          return
        }

        const inputNode = state.nodes[trackId]

        console.log(trackId)
        if (!inputNode || inputNode.isCustomNode || inputNode.nodeType !== 'input') {
          return
        }

        const targetNodeValue = state.nodeValues[inputNode.targetNodeId]

        const keyframe = {
          id: crypto.randomUUID(),
          time,
          valueType: 'boolean' as const,
          value: targetNodeValue === true,
        }

        trackNode.customData.keyframes.push(keyframe)
        trackNode.customData.keyframes.sort((a, b) => a.time - b.time)
      })
    },
    [engineStore],
  )

  return (
    <Panel>
      <PanelHeader>Timeline</PanelHeader>
      <PanelBody>
        <NodeContainer nodeId={IS_PLAYING_NODE_ID} />
        <Timeline
          timeline={timeline}
          playheadPosition={playheadPosition}
          onPlayheadChange={handlePlayheadChange}
          onKeyframeDelete={handleKeyframeDelete}
          onKeyframeInsert={handleKeyframeInsert}
        />
      </PanelBody>
    </Panel>
  )
}
