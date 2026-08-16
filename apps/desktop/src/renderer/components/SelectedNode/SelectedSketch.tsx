import {
  PanelSubHeader,
  sceneIcon,
  useAppStore,
  useEngine,
  useSceneNodes,
} from '@hedron-gl/ui-core'
import { useCallback } from 'react'
import { SketchNode } from '@hedron-gl/engine'
import c from './SelectedNode.module.css'

export const SelectedSketch = ({ sketchNode }: { sketchNode: SketchNode }) => {
  const selectedSceneId = useAppStore((state) => state.selectedSceneId)
  const engine = useEngine()
  const scenes = useSceneNodes()

  const onSceneChange = useCallback(
    (sceneId: string, shouldInclude: boolean) => {
      if (shouldInclude) {
        engine.addChildToNode(sceneId, 'sketchIds', sketchNode.id)
      } else {
        engine.removeChildFromNode(sceneId, 'sketchIds', sketchNode.id)
      }
    },
    [engine, sketchNode.id],
  )

  return (
    <>
      <PanelSubHeader
        iconName={sceneIcon}
        title="Share this sketch instance across multiple scenes"
      />
      <div className={c.sceneList}>
        {scenes.map((scene) => {
          const isCurrentScene = scene.id === selectedSceneId
          const isIncluded = scene.childGroups.sketchIds.includes(sketchNode.id)

          return (
            <label key={scene.id} className={c.sceneItem}>
              <input
                type="checkbox"
                checked={isIncluded}
                disabled={isCurrentScene}
                onChange={(event) => onSceneChange(scene.id, event.target.checked)}
              />
              <span className={c.sceneLabel}>{scene.title}</span>
            </label>
          )
        })}
      </div>
    </>
  )
}
