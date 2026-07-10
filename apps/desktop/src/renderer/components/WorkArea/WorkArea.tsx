import { Intro } from '@components/Intro/Intro'
import { CurrentScene } from '@components/CurrentScene/CurrentScene'
import { useAppStore } from '@renderer/appStore'

export const WorkArea = () => {
  const isShowingSketches = useAppStore((state) => state.sketchesDir)

  return isShowingSketches ? <CurrentScene /> : <Intro />
}
