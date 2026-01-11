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
  Param,
  useAppStore,
  useOnSelectNode,
} from '@hedron/ui-core'

import { Node } from '@hedron/engine'
import c from './ActiveSketch.module.css'
import { useActiveSketch } from '@components/hooks/useActiveSketch'
import { engineStore } from '@renderer/engine'
import { SketchControls } from '@components/SketchControls/SketchControls'
import { useGroupedNodes } from '@components/hooks/useGroupedNodes'
import { useSelectedParam } from '@components/hooks/useSelectedParam'
import { SelectedParam } from '@components/SelectedParam/SelectedParam'

interface ControlItemProps {
  node: Node
  sketchId: string
}

const ControlItem = ({ node, sketchId }: ControlItemProps) => {
  const isActive = useAppStore((state) => state.selectedNodes[sketchId] === node.id)
  const onSelectNode = useOnSelectNode(sketchId, node.id)

  switch (node.nodeType) {
    case 'param':
      return <Param onClick={onSelectNode} paramId={node.id} isActive={isActive} />
    case 'shot':
      return (
        <div style={{ display: 'block' }} onClick={onSelectNode}>
          Shot: {node.id}
        </div>
      )
    default:
      return null
  }
}

export const ActiveSketch = () => {
  const activeSketch = useActiveSketch()

  if (!activeSketch) {
    throw new Error('ActiveSketch component: No activesketch found')
  }

  const nodeGroups = useGroupedNodes(
    [...activeSketch.paramIds, ...activeSketch.shotIds],
    activeSketch.moduleId,
  )

  const selectedParam = useSelectedParam()

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

        {selectedParam && (
          <Panel snugPosition="bottom" spacing="slim" width="full" className={c.bottomPanel}>
            <PanelHeader iconName={paramIcon}>{selectedParam.title}</PanelHeader>
            <PanelBody>
              <SelectedParam />
            </PanelBody>
          </Panel>
        )}
      </HedronErrorBoundary>
    </div>
  )
}
