import { Node } from '@hedron-gl/engine'
import {
  Button,
  ViewHeader,
  Icon,
  paramIcon,
  Panel,
  PanelBody,
  PanelHeader,
  PanelBreadcrumbs,
  PopoutMenu,
  HedronErrorBoundary,
  useOnSelectNode,
  NodeContainer,
} from '@hedron-gl/ui-core'

import c from './ActiveSketch.module.css'
import { useSelectedSketch } from '@components/hooks/useSelectedSketch'
import { engineStore } from '@renderer/engine'
import { SketchControls } from '@components/SketchControls/SketchControls'
import { useGroupedNodes } from '@components/hooks/useGroupedNodes'
import { useSelectedNode } from '@components/hooks/useSelectedNode'
import { useNodeBreadcrumbs } from '@components/hooks/useNodeBreadcrumbs'
import { SelectedNode } from '@components/SelectedNode/SelectedNode'

const SelectedNodePanel = ({ node, onClose }: { node: Node; onClose: () => void }) => {
  const breadcrumbs = useNodeBreadcrumbs(node.id)

  return (
    <Panel snugPosition="bottom" spacing="slim" width="full" className={c.bottomPanel}>
      <PanelHeader iconName={paramIcon} buttonOnClick={onClose}>
        <PanelBreadcrumbs items={breadcrumbs} />
      </PanelHeader>
      <PanelBody>
        <SelectedNode />
      </PanelBody>
    </Panel>
  )
}

export const ActiveSketch = () => {
  const activeSketch = useSelectedSketch()

  if (!activeSketch) {
    throw new Error('ActiveSketch component: No activesketch found')
  }

  const nodeGroups = useGroupedNodes(activeSketch.childGroups.nodeIds, activeSketch.moduleId)

  const selectedNode = useSelectedNode()
  const closeSelectedNodePanel = useOnSelectNode(activeSketch.id, null)

  return (
    <div className={c.container}>
      <ViewHeader>
        <Icon name="token" /> {activeSketch.title}
        <PopoutMenu
          className="ml-auto"
          items={[
            {
              label: 'Move Up',
              icon: 'arrow_upward',
              onClick: () => engineStore.getState().moveSketchUp(activeSketch.id),
            },
            {
              label: 'Move Down',
              icon: 'arrow_downward',
              onClick: () => engineStore.getState().moveSketchDown(activeSketch.id),
            },
            {
              label: 'Delete Sketch',
              icon: 'delete',
              onClick: () => engineStore.getState().deleteNode(activeSketch.id),
            },
          ]}
        >
          <Button type="ghost" iconName="more_horiz" />
        </PopoutMenu>
      </ViewHeader>
      <HedronErrorBoundary key={activeSketch.id}>
        <div className={c.section}>
          <SketchControls
            sketchId={activeSketch.id}
            nodeGroups={nodeGroups}
            ControlItem={({ node }) => <NodeContainer nodeId={node.id} />}
          />
        </div>

        {selectedNode && <SelectedNodePanel node={selectedNode} onClose={closeSelectedNodePanel} />}
      </HedronErrorBoundary>
    </div>
  )
}
