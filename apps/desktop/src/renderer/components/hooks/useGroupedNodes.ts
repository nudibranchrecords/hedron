import { useMemo } from 'react'
import { useEngineStore } from '@hedron-gl/ui-core'
import { Node } from '@hedron-gl/engine'

type GroupedNodes = {
  groupTitle: string
  groupIndex: number
  children: Node[]
}

export const useGroupedNodes = (nodeIds: string[], moduleId: string) => {
  const nodes = useEngineStore((state) => state.nodes)
  const module = useEngineStore((state) => state.sketchModules[moduleId])

  const groupedNodes: GroupedNodes[] = useMemo(() => {
    const groups = [] as GroupedNodes[]

    nodeIds.forEach((id) => {
      const node = nodes[id]

      const groupIndex = node.groupIndex

      const group =
        groups[groupIndex] ||
        (groups[groupIndex] = {
          groupIndex,
          groupTitle: module?.config.groupInfo[groupIndex]?.groupTitle,
          children: [],
        })

      group.children.push({ ...node })
    })

    return groups
  }, [nodeIds, nodes, module])

  return groupedNodes
}
