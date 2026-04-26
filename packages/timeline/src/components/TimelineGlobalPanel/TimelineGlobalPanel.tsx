import React, { useCallback } from 'react'
import { HedronEngine } from '@hedron-gl/engine'
import { Panel, PanelHeader, PanelBody, NodeContainer, useEngineStore } from '@hedron-gl/ui-core'
import { useTimelineData } from './useTimelineData'
import { useTimelineManager } from './useTimelineManager'
import { Timeline } from '@/components/Timeline/Timeline'
import type { Keyframe, TimelineTrackInput } from '@/types'

const TIMELINE_NODE_ID = 'timeline-input-default-timeline'
const IS_PLAYING_NODE_ID = `${TIMELINE_NODE_ID}-option-isPlaying`
const PLAYHEAD_POSITION_NODE_ID = `${TIMELINE_NODE_ID}-option-playheadPosition`

interface TimelineGlobalPanelProps {
  engine: HedronEngine
}

export const TimelineGlobalPanel: React.FC<TimelineGlobalPanelProps> = ({ engine }) => {
  const timeline = useTimelineData()
  const manager = useTimelineManager(timeline)
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

  // TODO: Move these into their own handlers to keep the component neat
  const handleKeyframeDelete = useCallback(
    (keyframeId: string) => {
      for (const track of timeline.tracks) {
        const inputNode = engine.getNode<TimelineTrackInput>(track.id)

        if (!inputNode) continue

        const currentKeyframes: Keyframe[] = inputNode.customData?.keyframes ?? []
        const nextKeyframes = currentKeyframes.filter((kf) => kf.id !== keyframeId)

        if (nextKeyframes.length === currentKeyframes.length) continue

        engine.setNodeCustomData(track.id, { keyframes: nextKeyframes })
        return
      }
    },
    [engine, timeline.tracks],
  )

  // TODO: Move these into their own handlers to keep the component neat
  const handleKeyframeInsert = useCallback(
    (trackId: string, time: number) => {
      const inputNode = engine.getNode<TimelineTrackInput>(trackId)

      if (!inputNode || inputNode.isCustomNode || inputNode.nodeType !== 'input') {
        return
      }

      const targetNodeValue = engine.getNodeValue(inputNode.targetNodeId)

      const keyframe = {
        id: crypto.randomUUID(),
        time,
        valueType: 'boolean' as const,
        value: targetNodeValue === true,
      }

      const nextKeyframes: Keyframe[] = [...(inputNode.customData?.keyframes ?? []), keyframe].sort(
        (a, b) => a.time - b.time,
      )

      engine.setNodeCustomData(trackId, { keyframes: nextKeyframes })
    },
    [engine],
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
