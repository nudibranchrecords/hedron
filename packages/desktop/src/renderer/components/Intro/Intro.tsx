import { formatDistanceToNow } from 'date-fns'
import { ErrorBoundary } from 'react-error-boundary'
import {
  sceneIcon,
  sketchIcon,
  IconList,
  IconListItem,
  Panel,
  PanelActions,
  PanelBody,
  PanelHeader,
  Button,
  Card,
  CardActions,
  CardBody,
  CardContent,
  CardDetails,
  CardHeader,
  CardList,
} from '@hedron/ui-core'

import c from './Intro.module.css'
import { handleLoadProjectDialog, handleSketchesDialog } from '@renderer/handlers/fileHandlers'
import { SaveItem, useAppStore } from '@renderer/appStore'
import { pluralize } from '@renderer/utils/pluralize'
import { openFolder } from '@renderer/ipc/mainThreadTalk'

const RecentProjectItem = ({ item }: { item: SaveItem }) => {
  return (
    <Card>
      <CardContent>
        <CardHeader iconName="draft">{item.title}</CardHeader>
        <CardDetails>
          <a
            onClick={() => {
              openFolder(item.path)
            }}
            title="Open folder in file browser"
          >
            {item.path}
          </a>
        </CardDetails>
        <CardDetails>{formatDistanceToNow(item.date, { addSuffix: true })}</CardDetails>
        <CardBody>
          <IconList>
            <IconListItem iconName={sceneIcon}>
              {item.numScenes} {pluralize('Scene', item.numScenes)}
            </IconListItem>
            <IconListItem iconName={sketchIcon}>
              {item.numSketches} {pluralize('Sketch', item.numSketches)}
            </IconListItem>
          </IconList>
        </CardBody>
      </CardContent>
      <CardActions>
        <Button iconName="file_open" onClick={() => handleLoadProjectDialog(item.path)}>
          Open
        </Button>
      </CardActions>
    </Card>
  )
}

export const Intro = () => {
  const saveList = useAppStore((state) => state.saveList)

  return (
    <div className={c.wrapper}>
      <Panel className="mb-xxl">
        <PanelHeader>Welcome back</PanelHeader>
        <PanelBody>Choose your sketches folder or open a project to get started</PanelBody>
        <PanelActions>
          <Button onClick={handleSketchesDialog} iconName="folder_open">
            Select Sketches Folder
          </Button>
          <Button type="secondary" onClick={() => handleLoadProjectDialog()} iconName="file_open">
            Find Project File
          </Button>
        </PanelActions>
      </Panel>
      <h2 className={c.projectsTitle}>Recent Projects</h2>
      <CardList>
        {saveList.map((item) => (
          <ErrorBoundary key={item.path} fallbackRender={() => ''}>
            <RecentProjectItem item={item} />
          </ErrorBoundary>
        ))}
      </CardList>
    </div>
  )
}
