import { useAppStore } from '@renderer/appStore'

export const useSetActiveSketchId = () => {
  const setActiveSketchId = useAppStore((state) => state.setActiveSketchId)

  return setActiveSketchId
}
