import { useMemo } from 'react'
import { ParamWithInfo } from '@hedron/engine'
import { useActiveSketch } from '@components/hooks/useActiveSketch'
import { useEngineStore } from '@renderer/engine'

export const useActiveSketchParams = () => {
  const activeSketch = useActiveSketch()

  if (!activeSketch) {
    throw new Error('useActiveSketchParams hook: No active sketch found')
  }

  const [params, module] = useEngineStore((state) => [
    state.params,
    state.sketchModules[activeSketch.moduleId],
  ])

  const paramWithInfo: ParamWithInfo[] = useMemo(
    () =>
      activeSketch.paramIds.map((id, index) => {
        const param = params[id]
        const paramConfig = module?.config.params[index]
        const title = paramConfig?.title ?? paramConfig?.key
        return { ...param, title }
      }),
    [activeSketch, params, module],
  )

  return paramWithInfo
}
