import {
  Button,
  ViewHeader,
  Icon,
  paramIcon,
  Panel,
  PanelBody,
  PanelHeader,
  PopoutMenu,
  HedronErrorBoundary,
  useAppStore,
  useOnSelectNode,
  NodeContainer,
} from '@hedron/ui-core'

import { Node } from '@hedron/engine'
import c from './ActiveSketch.module.css'
import { useActiveSketch } from '@components/hooks/useActiveSketch'
import { engineStore } from '@renderer/engine'
import { SketchControls } from '@components/SketchControls/SketchControls'
import { useGroupedNodes } from '@components/hooks/useGroupedNodes'
import { useSelectedNode } from '@components/hooks/useSelectedNode'
import { SelectedNode } from '@components/SelectedNode/SelectedNode'

interface ControlItemProps {
  node: Node
  sketchId: string
}

const ControlItem = ({ node, sketchId }: ControlItemProps) => {
  const isActive = useAppStore((state) => state.selectedNodes[sketchId] === node.id)
  const onSelectNode = useOnSelectNode(sketchId, node.id)

  return <NodeContainer onClick={onSelectNode} nodeId={node.id} isActive={isActive} />
}

export const ActiveSketch = () => {
  const activeSketch = useActiveSketch()

  if (!activeSketch) {
    throw new Error('ActiveSketch component: No activesketch found')
  }

  const nodeGroups = useGroupedNodes(activeSketch.nodeIds, activeSketch.moduleId)

  const selectedNode = useSelectedNode()

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
              onClick: () => engineStore.getState().deleteSketch(activeSketch.id),
            },
          ]}
        >
          <Button type="ghost" iconName="menu" />
        </PopoutMenu>
      </ViewHeader>
      <HedronErrorBoundary key={activeSketch.id}>
        <div className={c.section}>
          <SketchControls
            sketchId={activeSketch.id}
            nodeGroups={nodeGroups}
            ControlItem={ControlItem}
          />
        </div>

        {selectedNode && (
          <Panel snugPosition="bottom" spacing="slim" width="full" className={c.bottomPanel}>
            <PanelHeader iconName={paramIcon}>{selectedNode.title}</PanelHeader>
            <PanelBody>
              <SelectedNode />
            </PanelBody>
          </Panel>
        )}
      </HedronErrorBoundary>
    </div>
  )
}
