import { useCallback } from 'react'
import c from './Intro.module.css'
import { Button } from '../core/Button/Button'
import { FileEvents } from 'src/shared/Events'
import { Panel, PanelActions, PanelBody, PanelHeader } from '../core/Panel/Panel'
import { useAppStore } from 'src/renderer/appStore'
import { engine, engineStore } from 'src/renderer/engine'
import { ProjectData } from 'src/engine/store/types'
import { openSketchesDirDialog } from 'src/renderer/ipc/mainThreadTalk'
import { startEngineWithSketchesDir } from 'src/renderer/setup'

const projectState: ProjectData = {
  sketches: {
    c64ceed4673: {
      id: 'c64ceed4673',
      moduleId: 'solid',
      title: 'Solid',
      paramIds: [
        '64ceed46737',
        '4ceed467370',
        'ceed467370c',
        'eed467370c5',
        'ed467370c5c',
        'd467370c5cb',
      ],
    },
    '467370c5cbd': {
      id: '467370c5cbd',
      moduleId: 'solid',
      title: 'Solid',
      paramIds: [
        '67370c5cbd2',
        '7370c5cbd2f',
        '370c5cbd2fd',
        '70c5cbd2fda',
        '0c5cbd2fda1',
        'c5cbd2fda13',
      ],
    },
    '5cbd2fda13a': {
      id: '5cbd2fda13a',
      moduleId: 'stars',
      title: 'stars',
      paramIds: ['cbd2fda13a6', 'bd2fda13a6c', 'd2fda13a6c0', '2fda13a6c07'],
    },
  },
  nodes: {
    '64ceed46737': {
      id: '64ceed46737',
      key: 'rotSpeedX',
      type: 'param',
      valueType: 'number',
      sketchId: 'c64ceed4673',
    },
    '4ceed467370': {
      id: '4ceed467370',
      key: 'rotSpeedY',
      type: 'param',
      valueType: 'number',
      sketchId: 'c64ceed4673',
    },
    ceed467370c: {
      id: 'ceed467370c',
      key: 'rotSpeedZ',
      type: 'param',
      valueType: 'number',
      sketchId: 'c64ceed4673',
    },
    eed467370c5: {
      id: 'eed467370c5',
      key: 'scale',
      type: 'param',
      valueType: 'number',
      sketchId: 'c64ceed4673',
    },
    ed467370c5c: {
      id: 'ed467370c5c',
      key: 'isWireframe',
      type: 'param',
      valueType: 'boolean',
      sketchId: 'c64ceed4673',
    },
    d467370c5cb: {
      id: 'd467370c5cb',
      key: 'geomName',
      type: 'param',
      valueType: 'enum',
      sketchId: 'c64ceed4673',
    },
    '67370c5cbd2': {
      id: '67370c5cbd2',
      key: 'rotSpeedX',
      type: 'param',
      valueType: 'number',
      sketchId: '467370c5cbd',
    },
    '7370c5cbd2f': {
      id: '7370c5cbd2f',
      key: 'rotSpeedY',
      type: 'param',
      valueType: 'number',
      sketchId: '467370c5cbd',
    },
    '370c5cbd2fd': {
      id: '370c5cbd2fd',
      key: 'rotSpeedZ',
      type: 'param',
      valueType: 'number',
      sketchId: '467370c5cbd',
    },
    '70c5cbd2fda': {
      id: '70c5cbd2fda',
      key: 'scale',
      type: 'param',
      valueType: 'number',
      sketchId: '467370c5cbd',
    },
    '0c5cbd2fda1': {
      id: '0c5cbd2fda1',
      key: 'isWireframe',
      type: 'param',
      valueType: 'boolean',
      sketchId: '467370c5cbd',
    },
    c5cbd2fda13: {
      id: 'c5cbd2fda13',
      key: 'geomName',
      type: 'param',
      valueType: 'enum',
      sketchId: '467370c5cbd',
    },
    cbd2fda13a6: {
      id: 'cbd2fda13a6',
      key: 'opacity',
      type: 'param',
      valueType: 'number',
      sketchId: '5cbd2fda13a',
    },
    bd2fda13a6c: {
      id: 'bd2fda13a6c',
      key: 'speed',
      type: 'param',
      valueType: 'number',
      sketchId: '5cbd2fda13a',
    },
    d2fda13a6c0: {
      id: 'd2fda13a6c0',
      key: 'velocity',
      type: 'param',
      valueType: 'number',
      sketchId: '5cbd2fda13a',
    },
    '2fda13a6c07': {
      id: '2fda13a6c07',
      key: 'randomWalk',
      type: 'param',
      valueType: 'number',
      sketchId: '5cbd2fda13a',
    },
  },
  nodeValues: {
    '64ceed46737': 0.5,
    '4ceed467370': 0.5,
    ceed467370c: 0.5,
    eed467370c5: 0.5,
    ed467370c5c: false,
    d467370c5cb: 'octa',
    '67370c5cbd2': 0.5,
    '7370c5cbd2f': 0.5,
    '370c5cbd2fd': 0.5,
    '70c5cbd2fda': 1,
    '0c5cbd2fda1': true,
    c5cbd2fda13: 'icosa',
    cbd2fda13a6: 1,
    bd2fda13a6c: 1,
    d2fda13a6c0: 0,
    '2fda13a6c07': 0,
  },
}

export const Intro = () => {
  const onSketchesButtonClick = useCallback(async () => {
    const sketchesDirPath = await openSketchesDirDialog()

    if (!sketchesDirPath) return

    await startEngineWithSketchesDir(sketchesDirPath)
  }, [])

  const onProjectButtonClick = useCallback(async () => {
    const sketchesDirPath = '/Users/alex/Sites/hedron/example-project/sketches'

    await startEngineWithSketchesDir(sketchesDirPath)

    engineStore.getState().loadProject(projectState)
  }, [])

  return (
    <div className={c.wrapper}>
      <Panel>
        <PanelHeader>Welcome back</PanelHeader>
        <PanelBody>Choose your sketches folder or open a project to get started</PanelBody>
        <PanelActions>
          <Button onClick={onSketchesButtonClick} iconName="folder_open">
            Select Sketches Folder
          </Button>
          <Button type="secondary" onClick={onProjectButtonClick} iconName="file_open">
            Open Project
          </Button>
        </PanelActions>
      </Panel>
    </div>
  )
}
