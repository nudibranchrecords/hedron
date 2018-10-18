import { connect } from 'react-redux'
import Param from '../../components/Param'
import { sketchNodeOpenedToggle } from '../../store/sketches/actions'
import getIsSketchNodeOpened from '../../selectors/getIsSketchNodeOpened'

const mapStateToProps = (state, ownProps) => {
  const param = state.nodes[ownProps.nodeId]
  return {
    title: param.title,
    isOpen: getIsSketchNodeOpened(state, ownProps.sketchId, ownProps.nodeId, 'param'),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onOpenClick: () => { dispatch(sketchNodeOpenedToggle(ownProps.sketchId, ownProps.nodeId, 'param')) },
})

const ParamContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Param)

export default ParamContainer
