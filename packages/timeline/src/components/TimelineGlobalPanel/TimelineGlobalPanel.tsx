import React from 'react'
import { HedronEngine, ParamFileValue } from '@hedron-gl/engine'
import {
  Panel,
  PanelHeader,
  PanelBody,
  NodeContainer,
  useNodeOptionNodes,
  useResource,
  useParamValue,
  FilePicker,
  useUpdateParamValue,
  useAppStore,
  NodeControl,
  NodeControlMain,
  ControlGrid,
  NodeControlInner,
} from '@hedron-gl/ui-core'
import { useTimelineData } from './useTimelineData'
import { useTimelineHandlers } from './useTimelineHandlers'
import { useTimelineManager } from './useTimelineManager'
import { DEFAULT_TIMELINE_ID } from '@/constants'
import { Timeline } from '@/components/Timeline/Timeline'
import { TimelineOptionNodes } from '@/TimelineInput'

interface TimelineGlobalPanelProps {
  engine: HedronEngine
}

export const TimelineGlobalPanel: React.FC<TimelineGlobalPanelProps> = ({ engine }) => {
  const timeline = useTimelineData()
  const manager = useTimelineManager(timeline)

  const { handlePlayheadChange, handleKeyframeDelete, handleKeyframeInsert } = useTimelineHandlers({
    engine,
    manager,
    timeline,
  })

  const optionNodes = useNodeOptionNodes<TimelineOptionNodes>(DEFAULT_TIMELINE_ID)
  const isPlayingNode = optionNodes['isPlaying']!
  const playHeadPositionNode = optionNodes['playheadPositionMs']!

  const audioUrlNode = optionNodes['audioUrl']!

  const audioFilename = useParamValue<ParamFileValue>(audioUrlNode.id)
  const updateParamValue = useUpdateParamValue()

  const audioUrl = useResource(audioFilename.fileName)

  const files = useAppStore((state) => state.resourcesFiles)

  const fileList = Object.values(files)

  // Not very performant to be updating state on every frame, later we'll want to do this imperatively using useSubscribeToParamValue
  const playheadPositionMs = useParamValue<number>(playHeadPositionNode.id)

  return (
    <Panel>
      <PanelHeader>Timeline</PanelHeader>
      <PanelBody>
        <ControlGrid>
          <NodeContainer nodeId={isPlayingNode.id} />
          <NodeControl>
            <NodeControlMain>
              <NodeControlInner>
                <FilePicker
                  currentFile={audioFilename}
                  accept={['audio/*']}
                  onFileChange={(file) => {
                    updateParamValue(audioUrlNode.id, file)
                  }}
                  availableFiles={fileList}
                />
              </NodeControlInner>
            </NodeControlMain>
          </NodeControl>
        </ControlGrid>
        {audioUrl && <audio src={audioUrl} controls style={{ width: '100%' }} />}
        <div className="mb-xl">
          <Timeline
            timeline={timeline}
            playheadPositionMs={playheadPositionMs}
            onPlayheadChange={handlePlayheadChange}
            onKeyframeDelete={handleKeyframeDelete}
            onKeyframeInsert={handleKeyframeInsert}
          />
        </div>
        Click track name to select track. Insert keyframe: [i]. Delete keyframe: [x].
      </PanelBody>
    </Panel>
  )
}
