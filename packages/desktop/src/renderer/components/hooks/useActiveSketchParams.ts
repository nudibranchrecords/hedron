import { useMemo } from 'react'
import { ParamWithInfo } from '@hedron/engine'
import { useActiveSketch } from '@components/hooks/useActiveSketch'
import { useEngineStore } from '@renderer/engine'

type GroupedParams = {
  isUngrouped?: boolean
  groupTitle: string
  groupIndex: number
  params: ParamWithInfo[]
}

export const useActiveSketchParams = () => {
  const activeSketch = useActiveSketch()

  if (!activeSketch) {
    throw new Error('useActiveSketchParams hook: No active sketch found')
  }

  const [nodes, module] = useEngineStore((state) => [
    state.nodes,
    state.sketchModules[activeSketch.moduleId],
  ])

  const groupedParams: GroupedParams[] = useMemo(() => {
    const groups = [] as GroupedParams[]

    activeSketch.paramIds.forEach((id) => {
      const node = nodes[id]
      const paramConfig = module?.config.params.find((p) => p.key === node.key)

      if (!paramConfig) {
        console.warn(`No param config found for node ${id} in sketch ${activeSketch.id}`)
        return
      }

      const title = paramConfig?.title ?? paramConfig?.key

      const isUngrouped = paramConfig.groupIndex === null
      const groupIndex = isUngrouped ? module.config.groupInfo.length : paramConfig.groupIndex!

      const group =
        groups[groupIndex] ||
        (groups[groupIndex] = {
          isUngrouped,
          groupIndex,
          groupTitle: module?.config.groupInfo[groupIndex]?.groupTitle,
          params: [],
        })

      group.params.push({ ...node, title })
    })

    return groups
  }, [activeSketch, nodes, module])

  return groupedParams
}
