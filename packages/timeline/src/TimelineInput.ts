import {
  defineOptionNodeConfigs,
  HedronEngine,
  InputNode,
  IPlugin,
  isEqual,
  OptionNodesFromConfigs,
  isParamVector,
  ParamNode,
  ParamValue,
  PluginUpdateArgs,
  ShotNode,
  isParamVectorComponent,
} from '@hedron-gl/engine'
import { DEFAULT_TIMELINE_ID, TIMELINE_DURATION } from './constants'
import { TimelineManager, OnAudioSourceChangeCallback } from './TimelineManager'
import { getTimelineTracks } from './selectors/getTimelineTracks'
import { getKeyframeTracks } from './utils/getKeyframeTracks'
import { getResourceUrl } from './utils/getResourceUrl'

// defineOptionNodeConfigs is only needed if we want nice TS node name inference in other parts of the plugin
export const TIMELINE_OPTION_NODE_CONFIGS = defineOptionNodeConfigs([
  {
    nodeType: 'param',
    key: 'playheadPositionMs',
    valueType: 'number',
    defaultValue: 0,
  },
  {
    nodeType: 'param',
    key: 'timelineDurationS',
    valueType: 'number',
    displayMode: 'field',
    defaultValue: 30,
  },
  {
    nodeType: 'param',
    key: 'isPlaying',
    valueType: 'boolean',
    defaultValue: false,
  },
  // This is a cheap hack to get audio working, eventually you'll manually add an audio track
  {
    nodeType: 'param',
    key: 'audioUrl',
    valueType: 'file',
    defaultValue: null,
    accept: ['audio/*'],
  },
  {
    nodeType: 'param',
    key: 'zoomPxPerSecond',
    title: 'Timeline Zoom',
    valueType: 'number',
    defaultValue: 10,
    sliderMin: 0.01,
    sliderMax: 300,
  },
])

// We can use TimelineOptionNodes for strong typing when using useNodeOptionNodes
export type TimelineOptionNodes = OptionNodesFromConfigs<typeof TIMELINE_OPTION_NODE_CONFIGS>

export class TimelineInput implements IPlugin {
  public readonly id = 'timeline-input'
  public readonly name = 'Timeline Input'
  public readonly iconName = 'timeline'
  public readonly inputType = 'timeline-track'
  public readonly description = 'Timeline-based input for automating parameters over time.'
  public timelineManagers: Map<string, TimelineManager> = new Map()

  private audioSourceChangeCallback: OnAudioSourceChangeCallback | null = null

  onEngineInitialize(engine: HedronEngine) {
    engine.addNodeOnce(DEFAULT_TIMELINE_ID, null, {
      title: 'Default Timeline',
      key: 'default-timeline',
      nodeType: 'custom',
      customNodeType: 'timeline',
    })

    engine.addOptionNodes(DEFAULT_TIMELINE_ID, TIMELINE_OPTION_NODE_CONFIGS)

    const playHeadPositionNode = engine.getNodeOptionNode(DEFAULT_TIMELINE_ID, 'playheadPositionMs')
    this.timelineManagers.set(
      DEFAULT_TIMELINE_ID,
      new TimelineManager({
        durationMs: TIMELINE_DURATION,
        tracks: [],
        clock: engine.clock,
        positionMs: 0,
        onPositionChange: (positionMs) => {
          engine.setParamValue(playHeadPositionNode.id, positionMs)
        },
      }),
    )

    this.timelineManagers.forEach((manager, timelineId) => {
      const isPlaying = engine.getNodeOptionNode(timelineId, 'isPlaying')
      const timelineDurationS = engine.getNodeOptionNode(timelineId, 'timelineDurationS')
      const playHeadPositionNode = engine.getNodeOptionNode(timelineId, 'playheadPositionMs')

      manager.onAudioSourceChange((source) => {
        this.audioSourceChangeCallback?.(source)
      })

      engine.getStore().subscribe(
        (state) => getTimelineTracks(state, timelineId),
        (tracks) => {
          manager.setTracks(tracks)
        },
        {
          equalityFn: isEqual,
          fireImmediately: true,
        },
      )

      // Snaps duration to the audio's exact length when a new resource is picked.
      const audioUrl = engine.getNodeOptionNode(timelineId, 'audioUrl')
      engine.subscribeToParamValue(
        audioUrl.id,
        (resourceId) => {
          if (typeof resourceId !== 'string' || !resourceId) return

          const url = getResourceUrl(engine.getStoreState(), resourceId)
          if (!url) return

          this.setDurationFromAudioUrl(engine, timelineDurationS.id, url)
        },
        {
          // We only want this to happen when the audio resource changes, as a convenience to the user
          fireImmediately: false,
        },
      )

      manager.onUpdate((changed) => {
        const changedTrackIds = Object.keys(changed)
        if (changedTrackIds.length > 0) {
          const allTracks = getTimelineTracks(engine.getStoreState(), timelineId)
          const tracks = getKeyframeTracks(allTracks)

          const paramTargetNodeIds: string[] = []
          const paramValues: ParamValue[] = []

          for (const trackId of changedTrackIds) {
            const targetNodeId =
              tracks.find((track) => track.id === trackId)?.targetNodeId ?? trackId
            const targetNode = engine.getNode(targetNodeId)
            const value = changed[trackId]

            if (targetNode?.nodeType === 'shot') {
              engine.fireShot(targetNodeId)
              continue
            }

            paramTargetNodeIds.push(targetNodeId)
            paramValues.push(value)
          }

          if (paramTargetNodeIds.length > 0) {
            engine.setMultipleParamValues(paramTargetNodeIds, paramValues)
          }
        }
      })

      engine.subscribeToParamValue<number>(playHeadPositionNode.id, (positionMs) => {
        if (positionMs !== undefined) manager.setPositionMs(positionMs)
      })

      engine.subscribeToParamValue<number>(timelineDurationS.id, (timelineDurationS) => {
        if (timelineDurationS !== undefined && timelineDurationS > 0) {
          manager.setDurationMs(timelineDurationS * 1000)
        }
      })

      engine.subscribeToParamValue(isPlaying.id, (isPlaying) => {
        if (isPlaying) {
          manager.play()
        } else {
          manager.pause()
        }
      })
    })
  }

  onAudioSourceChange(callback: OnAudioSourceChangeCallback) {
    this.audioSourceChangeCallback = callback
    this.timelineManagers.forEach((manager) => {
      manager.onAudioSourceChange((source) => this.audioSourceChangeCallback?.(source))
    })
  }

  /** Decodes the audio at `url` and writes its exact duration (in seconds) to the duration param. */
  private async setDurationFromAudioUrl(engine: HedronEngine, durationNodeId: string, url: string) {
    try {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()

      const audioContext = new AudioContext()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      await audioContext.close()

      const exactSeconds = audioBuffer.length / audioBuffer.sampleRate
      engine.setParamValue(durationNodeId, exactSeconds)
    } catch (error) {
      console.error('[TimelineInput] Failed to derive duration from audio resource:', error)
    }
  }

  update(_engine: HedronEngine, { deltaTime }: PluginUpdateArgs) {
    this.timelineManagers.forEach((manager) => {
      if (manager.isPlaying()) {
        manager.playback.step(deltaTime * 1000)
      }
    })
  }

  onNewInput(engine: HedronEngine, newInput: InputNode, targetNode: ParamNode | ShotNode) {
    // Don't do anything if we're dealing with a vector component (e.g. x,y,z)
    if (isParamVectorComponent(targetNode, engine)) {
      return
    }

    // Input ID is only a child of the target node, we also need to make it a child of the timeline node so it shows up in the timeline UI
    engine.addChildToNode(DEFAULT_TIMELINE_ID, 'trackIds', newInput.id)

    engine.addOptionNodes(newInput.id, [
      {
        nodeType: 'param',
        key: 'zoomPxPerSecond',
        title: 'Track Zoom',
        valueType: 'number',
        defaultValue: 80,
        sliderMin: 10,
        sliderMax: 300,
      },
    ])

    if (isParamVector(targetNode)) {
      targetNode.childGroups.vectorComponentIds.forEach((nodeId) => {
        const childInput = engine.addInput(this.inputType, nodeId)!

        // Add vector components as children of parent track
        engine.addChildToNode(newInput.id, 'trackIds', childInput.id)
      })
    }
  }
}
