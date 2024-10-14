import { Intro } from '@components/Intro/Intro'
import { Sketches } from '@components/Sketches/Sketches'
import { useAppStore } from '@renderer/appStore'

export const WorkArea = () => {
  const isShowingSketches = useAppStore((state) => state.sketchesDir)

  return isShowingSketches ? <Sketches /> : <Intro />
}
