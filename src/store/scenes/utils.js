import uid from 'uid'
import { rSceneSelectChannel, uSceneSelectChannel, sceneClearChannel } from './actions'

export const generateSceneLinkableActionIds = id => ({
  addToA: {
    action: rSceneSelectChannel(id, 'A'),
    id: uid(),
    title: 'Add to A',
  },
  addToB: {
    action: rSceneSelectChannel(id, 'B'),
    id: uid(),
    title: 'Add to B',
  },
  addToActive: {
    action: uSceneSelectChannel(id, 'active'),
    id: uid(),
    title: 'Add to Active',
  },
  addToOpposite: {
    action: uSceneSelectChannel(id, 'opposite'),
    id: uid(),
    title: 'Add to Opposite',
  },
  clear: {
    action: sceneClearChannel(id),
    id: uid(),
    title: 'Clear',
  },
})
