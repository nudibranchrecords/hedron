import uid from 'uid'
import { rSceneSelectChannel, uSceneSelectChannel, sceneClearChannel } from './actions'

export const generateSceneLinkableActionIds = id => ({
  addToA: {
    action: rSceneSelectChannel(id, 'A'),
    id: uid(),
  },
  addToB: {
    action: rSceneSelectChannel(id, 'B'),
    id: uid(),
  },
  addToActive: {
    action: uSceneSelectChannel(id, 'active'),
    id: uid(),
  },
  addToOpposite: {
    action: uSceneSelectChannel(id, 'opposite'),
    id: uid(),
  },
  clear: {
    action: sceneClearChannel(id),
    id: uid(),
  },
})
