import { useMemo } from 'react'
import { BreadcrumbItem, useEngineStore } from '@hedron-gl/ui-core'
import { Node } from '@hedron-gl/engine'
import { useAppStore } from '@renderer/appStore'
import { useSelectedSketch } from '@components/hooks/useSelectedSketch'

interface BreadcrumbData {
  label: string
  id: string
  isSelectable: boolean
}

export const useNodeBreadcrumbs = (nodeId: string): BreadcrumbItem[] => {
  const selectedSketch = useSelectedSketch()
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
          return nodeType && nodeType !== 'custom'
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
          item.isSelectable && selectedSketch && i < data.length - 1
            ? () => selectNode(selectedSketch.id, item.id)
            : undefined,
      })),
    [data, selectedSketch, selectNode],
  )
}
