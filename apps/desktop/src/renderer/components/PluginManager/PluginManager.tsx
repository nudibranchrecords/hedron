import { useState } from 'react'
import { Button, Icon } from '@hedron-gl/ui-core'
import c from './PluginManager.module.css'
import { pluginActions, usePluginHost } from '@renderer/plugins/pluginHost'
import { openFolder } from '@renderer/ipc/mainThreadTalk'
import { PluginInfo } from '@shared/PluginEvents'

const PluginRow = ({ plugin, loadError }: { plugin: PluginInfo; loadError?: string }) => {
  const errors = loadError ? [...plugin.errors, loadError] : plugin.errors
  const isRunning =
    plugin.enabled && errors.length === 0 && (!!plugin.rendererUrl || plugin.mainActive)
  const status = !plugin.enabled
    ? 'Disabled'
    : errors.length > 0
      ? 'Error'
      : isRunning
        ? 'Loaded'
        : 'Loading'

  return (
    <li className={c.plugin}>
      <div className={c.pluginHeader}>
        <Icon name={errors.length > 0 && plugin.enabled ? 'error' : 'extension'} />
        <span className={c.name}>{plugin.name}</span>
        <span className={c.meta}>
          {plugin.version} · {plugin.source === 'project' ? 'project' : 'user'} · {status}
        </span>
      </div>
      {plugin.description && <div className={c.description}>{plugin.description}</div>}
      {plugin.enabled && errors.length > 0 && <pre className={c.errors}>{errors.join('\n\n')}</pre>}
      <div className={c.actions}>
        <Button
          size="slim"
          type="secondary"
          onClick={() => pluginActions.setEnabled(plugin.id, !plugin.enabled)}
        >
          {plugin.enabled ? 'Disable' : 'Enable'}
        </Button>
        <Button
          size="slim"
          type="ghost"
          iconName="refresh"
          disabled={!plugin.enabled}
          onClick={() => pluginActions.reload(plugin.id)}
        >
          Reload
        </Button>
        <Button
          size="slim"
          type="ghost"
          iconName="folder_open"
          onClick={() => openFolder(plugin.dir)}
        >
          Folder
        </Button>
      </div>
    </li>
  )
}

/** Lists runtime plugins and the folders they're loaded from. */
export const PluginManager = () => {
  const plugins = usePluginHost((state) => state.plugins)
  const folders = usePluginHost((state) => state.folders)
  const loadErrors = usePluginHost((state) => state.loadErrors)
  const [addError, setAddError] = useState<string | null>(null)

  const onAddFolder = async () => {
    const { error } = await pluginActions.addFolder()
    setAddError(error ?? null)
  }

  return (
    <div className={c.wrapper}>
      {plugins.length === 0 ? (
        <div className={c.empty}>
          No plugins yet. Add a folder containing a Hedron plugin, or put plugins in a{' '}
          <code>plugins</code> folder beside your project&apos;s sketches.
        </div>
      ) : (
        <ul className={c.list}>
          {plugins.map((plugin) => (
            <PluginRow key={plugin.dir} plugin={plugin} loadError={loadErrors[plugin.id]} />
          ))}
        </ul>
      )}

      <h4 className={c.heading}>Plugin folders</h4>
      <ul className={c.list}>
        {folders.map((folder) => (
          <li key={folder} className={c.folder}>
            <span className={c.path} title={folder}>
              {folder}
            </span>
            <Button
              size="slim"
              type="ghost"
              iconName="close"
              title="Remove folder"
              onClick={() => pluginActions.removeFolder(folder)}
            />
          </li>
        ))}
      </ul>
      {addError && <div className={c.addError}>{addError}</div>}
      <Button size="slim" iconName="add" onClick={onAddFolder}>
        Add plugin folder
      </Button>
    </div>
  )
}
