import { useCallback } from 'react'
import c from './Intro.module.css'
import { Button } from '../core/Button/Button'
import { FileEvents } from 'src/shared/Events'
import { Panel, PanelActions, PanelBody, PanelHeader } from '../core/Panel/Panel'

export const Intro = () => {
  const onButtonClick = useCallback(() => {
    window.electron.ipcRenderer.send(FileEvents.OpenSketchesDirDialog)
  }, [])

  return (
    <div className={c.wrapper}>
      <Panel>
        <PanelHeader>Welcome back</PanelHeader>
        <PanelBody>Choose your sketches folder or open a project to get started</PanelBody>
        <PanelActions>
          <Button onClick={onButtonClick}>Select Sketches Folder</Button>
        </PanelActions>
      </Panel>
    </div>
  )
}
