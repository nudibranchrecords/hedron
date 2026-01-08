import {
  Button,
  ViewHeader,
  Icon,
  paramIcon,
  Panel,
  PanelBody,
  PanelHeader,
  PopoutMenu,
} from '@hedron/ui-core'
import c from './ActiveSketch.module.css'
import { useActiveSketch } from '@components/hooks/useActiveSketch'
import { engineStore } from '@renderer/engine'
import { SketchParams } from '@components/SketchParams/SketchParams'
import { useSelectedParam } from '@components/hooks/useSelectedParam'
import { SelectedParam } from '@components/SelectedParam/SelectedParam'

export const ActiveSketch = () => {
  const activeSketch = useActiveSketch()

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
      <div className={c.section}>
        <SketchParams sketchId={activeSketch.id} />
      </div>

      {selectedParam && (
        <Panel snugPosition="bottom" spacing="slim" width="full" className={c.bottomPanel}>
          <PanelHeader iconName={paramIcon}>{selectedParam.title}</PanelHeader>
          <PanelBody>
            <SelectedParam />
          </PanelBody>
        </Panel>
      )}
    </div>
  )
}
