import { connect } from 'react-redux'
import SketchParam from '../../components/SketchParam'
import getNodeInputLinkIds from '../../selectors/getNodeInputLinkIds'

const mapStateToProps = (state, ownProps) => {
  return {
    inputLinkIds: getNodeInputLinkIds(state, ownProps.nodeId)
  }
}

const ParamContainer = connect(
  mapStateToProps
)(SketchParam)

export default ParamContainer
