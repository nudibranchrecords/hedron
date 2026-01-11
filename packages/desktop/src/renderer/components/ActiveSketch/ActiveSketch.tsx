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

import c from './ActiveSketch.module.css'
import { useActiveSketch } from '@components/hooks/useActiveSketch'
import { engineStore } from '@renderer/engine'
import { SketchControls } from '@components/SketchControls/SketchControls'
import { useActiveSketchParams } from '@components/hooks/useActiveSketchParams'
import { useSelectedParam } from '@components/hooks/useSelectedParam'
import { SelectedParam } from '@components/SelectedParam/SelectedParam'

interface ParamItemProps {
  nodeId: string
  sketchId: string
}

const ParamItem = ({ nodeId, sketchId }: ParamItemProps) => {
  const isActive = useAppStore((state) => state.selectedNodes[sketchId] === nodeId)
  const onSelectNode = useOnSelectNode(sketchId, nodeId)

  return <Param onClick={onSelectNode} paramId={nodeId} isActive={isActive} />
}

const NodeItem = ({ nodeId, sketchId }: ParamItemProps) => {
  const isActive = useAppStore((state) => state.selectedNodes[sketchId] === nodeId)
  const onSelectNode = useOnSelectNode(sketchId, nodeId)

  return (
    <div style={{ display: 'block' }} onClick={onSelectNode}>
      Shot: {nodeId}
    </div>
  )
}

export const ActiveSketch = () => {
  const activeSketch = useActiveSketch()
  const paramGroups = useActiveSketchParams()

  if (!activeSketch) {
    throw new Error('ActiveSketch component: No activesketch found')
  }

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
            nodeGroups={paramGroups}
            ControlItem={ParamItem}
          />
          <SketchControls
            sketchId={activeSketch.id}
            nodeGroups={paramGroups}
            ControlItem={NodeItem}
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
