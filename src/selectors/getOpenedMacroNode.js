import getMacro from './getMacro'
import getNode from './getNode'

export default (state) => {
  const macro = getMacro(state, state.macros.openedId)
  return macro ? getNode(state, macro.nodeId) : undefined
}
