import { SelectedParamOrShot } from './SelectedParamOrShot'
import { SelectedSketch } from './SelectedSketch'
import { useSelectedNode } from '@components/hooks/useSelectedNode'

export const SelectedNode = () => {
  const selectedNode = useSelectedNode()

  if (!selectedNode) {
    throw new Error(
      'SelectedNode component: selected node not found. This component should only be used when a node is selected',
    )
  }

  switch (selectedNode.nodeType) {
    case 'sketch':
      return <SelectedSketch sketchNode={selectedNode} />
    case 'param':
    case 'shot':
      return <SelectedParamOrShot node={selectedNode} />
    default:
      return <i>Unsupported selected node type {selectedNode.nodeType}</i>
  }
}
