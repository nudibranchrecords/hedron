import { useAppStore } from '@renderer/appStore'

export const useSetSelectedSketchId = () => {
  const selectedSceneId = useAppStore((state) => state.selectedSceneId)
  const setSelectedSketch = useAppStore((state) => state.setSelectedSketch)

  return (sketchId: string | null) => {
    if (!selectedSceneId) {
      return
    }

    setSelectedSketch(selectedSceneId, sketchId)
  }
}
