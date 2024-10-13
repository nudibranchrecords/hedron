import c from './Intro.module.css'
import { Button } from '../core/Button/Button'
import { Panel, PanelActions, PanelBody, PanelHeader } from '../core/Panel/Panel'
import { handleLoadProjectDialog, handleSketchesDialog } from '../../handlers/fileHandlers'
import { SaveItem, useAppStore } from 'src/renderer/appStore'
import { formatDistanceToNow } from 'date-fns'
import {
  Card,
  CardActions,
  CardBody,
  CardContent,
  CardDetails,
  CardHeader,
  CardList,
} from '../core/Card/Card'
import { ErrorBoundary } from 'react-error-boundary'
import { sceneIcon, sketchIcon } from '../core/Icon/Icon'
import { IconList, IconListItem } from '../core/IconList/IconList'
import { pluralize } from 'src/renderer/utils/pluralize'

const RecentProjectItem = ({ item }: { item: SaveItem }) => {
  return (
    <Card>
      <CardContent>
        <CardHeader iconName="draft">{item.title}</CardHeader>
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
