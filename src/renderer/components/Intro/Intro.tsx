import c from './Intro.module.css'
import { Button } from '../core/Button/Button'
import { Panel, PanelActions, PanelBody, PanelHeader } from '../core/Panel/Panel'
import { handleLoadProjectDialog, handleSketchesDialog } from '../../handlers/fileHandlers'

export const Intro = () => {
  return (
    <div className={c.wrapper}>
      <Panel>
        <PanelHeader>Welcome back</PanelHeader>
        <PanelBody>Choose your sketches folder or open a project to get started</PanelBody>
        <PanelActions>
          <Button onClick={handleSketchesDialog} iconName="folder_open">
            Select Sketches Folder
          </Button>
          <Button type="secondary" onClick={handleLoadProjectDialog} iconName="file_open">
            Open Project
          </Button>
        </PanelActions>
      </Panel>
    </div>
  )
}
