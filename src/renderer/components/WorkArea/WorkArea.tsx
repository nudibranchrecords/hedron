import { Sketches } from '../Sketches/Sketches'
import { Intro } from '../Intro/Intro'
import { useAppStore } from 'src/renderer/appStore'

export const WorkArea = () => {
  const isShowingSketches = useAppStore((state) => state.sketchesDir)

  return isShowingSketches ? <Sketches /> : <Intro />
}
