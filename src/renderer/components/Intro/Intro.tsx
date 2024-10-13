import c from './Intro.module.css'
import { Button } from '../core/Button/Button'
import { Panel, PanelActions, PanelBody, PanelHeader } from '../core/Panel/Panel'
import { handleLoadProjectDialog, handleSketchesDialog } from '../../handlers/fileHandlers'
import { useAppStore } from 'src/renderer/appStore'

export const Intro = () => {
  const saveList = useAppStore((state) => state.saveList)

  return (
    <div className={c.wrapper}>
      <Panel className="mb-xl">
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
      <Panel>
        <PanelHeader>Recent Projects</PanelHeader>
        <PanelBody>
          {saveList.map((item) => (
            <div key={item.path}>{item.path}</div>
          ))}
        </PanelBody>
      </Panel>
    </div>
  )
}
