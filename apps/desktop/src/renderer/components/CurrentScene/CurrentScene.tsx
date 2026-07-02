import {
  Button,
  Icon,
  Panel,
  PanelBody,
  PanelHeader,
  PopoutMenu,
  ViewHeader,
  sceneIcon,
  useEngineStore,
} from '@hedron-gl/ui-core'
import c from './CurrentScene.module.css'
import { useAppStore } from '@renderer/appStore'
import { Sketches } from '@components/Sketches/Sketches'

export const CurrentScene = () => {
  const sceneIds = useEngineStore((state) => state.sceneIds)
  const deleteScene = useEngineStore((state) => state.deleteScene)

  const selectedSceneId = useAppStore((state) => state.selectedSceneId)
  const setSelectedSceneId = useAppStore((state) => state.setSelectedSceneId)
  const activeScene = useEngineStore((state) =>
    selectedSceneId ? state.nodes[selectedSceneId] : undefined,
  )

  const handleDeleteCurrentScene = () => {
    if (!selectedSceneId) {
      return
    }

    const fallbackSceneId = sceneIds.find((id) => id !== selectedSceneId)

    if (fallbackSceneId) {
      setSelectedSceneId(fallbackSceneId)
    }

    deleteScene(selectedSceneId)
  }

  if (!activeScene || activeScene.nodeType !== 'scene') {
    return (
      <div className={c.wrapper}>
        <ViewHeader>
          <Icon name={sceneIcon} /> No Scene Selected
        </ViewHeader>
        <div className={c.content}>
          <div className={c.intro}>
            <Panel>
              <PanelHeader iconName="info">Add A Scene</PanelHeader>
              <PanelBody>
                Use the &quot;Add Scene&quot; button in the Scenes panel to create your first scene.
              </PanelBody>
            </Panel>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={c.wrapper}>
      <ViewHeader>
        <Icon name={sceneIcon} /> {activeScene.title}
        <PopoutMenu
          className="ml-auto"
          items={[
            {
              label: 'Delete Scene',
              icon: 'delete',
              onClick: handleDeleteCurrentScene,
            },
          ]}
        >
          <Button type="ghost" iconName="more_horiz" />
        </PopoutMenu>
      </ViewHeader>
      <div className={c.content}>
        <Sketches />
      </div>
    </div>
  )
}
