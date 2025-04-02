import { IPlugin, ParamWithInfo } from '@hedron/engine'
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
import { engine, engineStore } from '@renderer/engine'
import { SketchParams } from '@components/SketchParams/SketchParams'
import { useSelectedParam } from '@components/hooks/useSelectedParam'

const PluginViewWrapper = ({
  plugin,
  selectedParam,
}: {
  plugin: IPlugin
  selectedParam: ParamWithInfo | null
}) => {
  const view = plugin.getSelectedParamView?.(selectedParam!)
  return view ? view : null
}

export const ActiveSketch = () => {
  const activeSketch = useActiveSketch()

  if (!activeSketch) {
    throw new Error('ActiveSketch component: No activesketch found')
  }

  const selectedParam = useSelectedParam()

  const pluginView = engine.plugins.map((plugin) => (
    <PluginViewWrapper
      key={`ActiveParam-${plugin.name}`}
      plugin={plugin}
      selectedParam={selectedParam}
    />
  ))

  return (
    <>
      <ViewHeader>
        <Icon name="token" /> {activeSketch.title}
        <PopoutMenu
          className="ml-auto"
          items={[
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
        <SketchParams />
      </div>

      {selectedParam && (
        <Panel snugPosition="bottom" spacing="slim" width="full" className={c.bottomPanel}>
          <PanelHeader iconName={paramIcon}>{selectedParam.title}</PanelHeader>
          <PanelBody>{pluginView}</PanelBody>
        </Panel>
      )}
    </>
  )
}
