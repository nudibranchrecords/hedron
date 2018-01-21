import { connect } from 'react-redux'
import Param from '../../components/Param'
import getNode from '../../selectors/getNode'
import { sketchNodeOpenedToggle } from '../../store/sketches/actions'
import getIsSketchNodeOpened from '../../selectors/getIsSketchNodeOpened'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const inputLinkIds = node.inputLinkIds
  const param = state.nodes[ownProps.nodeId]
  const type = ownProps.type || 'param'

  return {
    numInputs: inputLinkIds.length,
    numMacros: node.connectedMacroIds.length,
    title: param.title,
    isOpen: getIsSketchNodeOpened(state, ownProps.sketchId, ownProps.nodeId, type)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onOpenClick: () => {
    const type = ownProps.type || 'param'
    dispatch(sketchNodeOpenedToggle(ownProps.sketchId, ownProps.nodeId, type))
  }
})

const ParamContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Param)

export default ParamContainer
