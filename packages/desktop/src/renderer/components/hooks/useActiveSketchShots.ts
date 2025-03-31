import { useMemo } from 'react'
import { Shot } from '@hedron/engine'
import { useActiveSketch } from '@components/hooks/useActiveSketch'
import { useEngineStore } from '@renderer/engine'

export const useActiveSketchShots = () => {
  const activeSketch = useActiveSketch()

  if (!activeSketch) {
    throw new Error('useActiveSketchParams hook: No active sketch found')
  }

  const [shots, module] = useEngineStore((state) => [
    state.shots,
    state.sketchModules[activeSketch.moduleId],
  ])

  const params: (Shot & { title: string })[] = useMemo(
    () =>
      activeSketch.shotIds?.map((id, index) => {
        const node = shots[id]
        const paramConfig = module?.config.shots[index]
        const title = paramConfig?.title ?? paramConfig?.method
        return { ...node, title }
      }),
    [activeSketch, shots, module],
  )

  return params
}
