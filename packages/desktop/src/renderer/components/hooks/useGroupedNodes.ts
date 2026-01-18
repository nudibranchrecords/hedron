import { useMemo } from 'react'
import { useEngineStore } from '@hedron/ui-core'
import { Node } from '@hedron/engine'

type GroupedNodes = {
  groupTitle: string
  groupIndex: number
  children: Node[]
}

export const useGroupedNodes = (nodeIds: string[], moduleId: string) => {
  const [nodes, module] = useEngineStore((state) => [state.nodes, state.sketchModules[moduleId]])

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
