import { SceneNode } from '@hedron-gl/engine'
import { useEngineStoreShallow } from './engineHooks'

export const useSceneNodes = () =>
  useEngineStoreShallow((state) =>
    state.sceneIds
      .map((id) => state.nodes[id])
      .filter((node): node is SceneNode => node?.nodeType === 'scene'),
  )
