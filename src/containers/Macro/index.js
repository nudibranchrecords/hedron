import { connect } from 'react-redux'
import Node from '../../components/Node'
import { sketchNodeOpenedToggle } from '../../store/sketches/actions'
import getIsSketchNodeOpened from '../../selectors/getIsSketchNodeOpened'

const mapStateToProps = (state, ownProps) => {
  const param = state.nodes[ownProps.nodeId]
  return {
    title: param.title,
    isOpen: getIsSketchNodeOpened(state, ownProps.sketchId, ownProps.nodeId),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onOpenClick: () => { dispatch(sketchNodeOpenedToggle(ownProps.sketchId, ownProps.nodeId)) },
})

const ParamContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Node)

export default ParamContainer
