import { createSelector } from 'reselect'

const getSketchParamIds = (state, props) => state.sketches[props.sketchId].paramIds
const getAllNodes = (state) => state.nodes

const makeGetVisibleSketchParamIds = () =>
  createSelector(
    [getSketchParamIds, getAllNodes],
    (sketchParamIds, nodes) => {
      return sketchParamIds.map(id => nodes[id]).filter(node => !node.hidden).map(node => node.id)
    }
  )

export default makeGetVisibleSketchParamIds
