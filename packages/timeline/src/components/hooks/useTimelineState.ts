import { useAppStore } from '@hedron-gl/ui-core'

export const useTimelineState = () => {
  const activeTimelineComponentId = useAppStore((state) => state.activeTimelineComponentId)
  const setActiveTimelineComponentId = useAppStore((state) => state.setActiveTimelineComponentId)
  const selectedTrackId = useAppStore((state) => state.selectedTimelineTrackId)
  const setSelectedTrackId = useAppStore((state) => state.setSelectedTimelineTrackId)

  return {
    activeTimelineComponentId,
    setActiveTimelineComponentId,
    selectedTrackId,
    setSelectedTrackId,
  }
}
