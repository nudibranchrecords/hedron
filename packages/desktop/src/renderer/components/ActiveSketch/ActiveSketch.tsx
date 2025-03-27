import { IPlugin, ParamWithInfo } from '@hedron/engine'
import {
  Button,
  ViewHeader,
  Card,
  CardActions,
  Icon,
  paramIcon,
  Panel,
  PanelBody,
  PanelHeader,
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
      </ViewHeader>
      <div className={c.section}>
        <SketchParams />
      </div>
      <Card>
        <CardActions>
          <Button
            type="danger"
            iconName="delete"
            onClick={() => engineStore.getState().deleteSketch(activeSketch.id)}
          >
            Delete Sketch
          </Button>
        </CardActions>
      </Card>
      {selectedParam && (
        <Panel snugPosition="bottom" spacing="slim" width="full" className={c.bottomPanel}>
          <PanelHeader iconName={paramIcon}>{selectedParam.title}</PanelHeader>
          <PanelBody>{pluginView}</PanelBody>
        </Panel>
      )}
    </>
  )
}
