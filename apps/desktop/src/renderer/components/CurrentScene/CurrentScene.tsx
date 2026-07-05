import {
  Button,
  Icon,
  Panel,
  PanelBody,
  PanelHeader,
  PopoutMenu,
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

  const hasActiveScene = activeScene?.nodeType === 'scene'
  const sceneTitle = hasActiveScene ? activeScene.title : 'No Scene Selected'

  return (
    <div className={c.wrapper}>
      <header className={c.sceneHeader}>
        <Icon name={sceneIcon} /> {sceneTitle}
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
          <Button type="ghost" iconName="more_horiz" disabled={!hasActiveScene} />
        </PopoutMenu>
      </header>
      <div className={c.content}>
        {hasActiveScene ? (
          <Sketches />
        ) : (
          <div className={c.intro}>
            <Panel>
              <PanelHeader iconName="info">Add A Scene</PanelHeader>
              <PanelBody>
                Use the &quot;Add Scene&quot; button in the Scenes panel to create your first scene.
              </PanelBody>
            </Panel>
          </div>
        )}
      </div>
    </div>
  )
}
