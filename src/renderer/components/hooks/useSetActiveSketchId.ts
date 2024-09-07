import { useAppStore } from 'src/renderer/appStore'

export const useSetActiveSketchId = () => {
  const setActiveSketchId = useAppStore((state) => state.setActiveSketchId)

  return setActiveSketchId
}
