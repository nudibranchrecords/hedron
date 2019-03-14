import getNode from './getNode'

export default (state) => {
  return getNode(state, state.macros.openedId)
}
