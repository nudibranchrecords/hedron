import { useAppStore } from 'src/renderer/appStore'
import { Sketches } from '../Sketches/Sketches'
import { Intro } from '../Intro/Intro'

export const WorkArea = () => {
  const isShowingSketches = useAppStore((state) => state.sketchesDir)

  return isShowingSketches ? <Sketches /> : <Intro />
}
