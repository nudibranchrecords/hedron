import { useMemo } from 'react'
import { BreadcrumbItem, useEngineStore } from '@hedron-gl/ui-core'
import { Node } from '@hedron-gl/engine'
import { useAppStore } from '@renderer/appStore'
import { useActiveSketch } from '@components/hooks/useActiveSketch'

interface BreadcrumbData {
  label: string
  id: string
  isSelectable: boolean
}

export const useNodeBreadcrumbs = (nodeId: string): BreadcrumbItem[] => {
  const activeSketch = useActiveSketch()
  const selectNode = useAppStore((state) => state.setSelectedNode)

  const nodes = useEngineStore((state) => state.nodes)

  const data = useMemo(() => {
    const breadcrumbs: BreadcrumbData[] = []
    let currentId: string | null = nodeId

    while (currentId) {
      const node: Node | undefined = nodes[currentId]
      if (!node) break
      breadcrumbs.unshift({
        label: node.title,
        id: node.id,
        isSelectable: node.nodeType === 'param' || node.nodeType === 'shot',
      })
      currentId =
        node.parentIds.find((id) => {
          const nodeType = nodes[id]?.nodeType
          // Only consider parent nodes that are of type 'param', 'shot', or 'input' for breadcrumb navigation
          // (e.g. NOT some plugin type, such as 'timeline')
          return nodeType === 'param' || nodeType === 'shot' || nodeType === 'input'
        }) || null
    }

    return breadcrumbs
  }, [nodes, nodeId])

  return useMemo(
    () =>
      data.map((item, i) => ({
        label: item.label,
        id: item.id,
        onClick:
          item.isSelectable && activeSketch && i < data.length - 1
            ? () => selectNode(activeSketch.id, item.id)
            : undefined,
      })),
    [data, activeSketch, selectNode],
  )
}
