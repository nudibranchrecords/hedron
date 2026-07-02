import { useAppStore } from '@renderer/appStore'

export const useIsSelectedSketch = (id: string) => {
  const selectedSceneId = useAppStore((state) => state.selectedSceneId)
  const selectedSketches = useAppStore((state) => state.selectedSketches)

  if (!selectedSceneId) {
    return false
  }

  return selectedSketches[selectedSceneId] === id
}
