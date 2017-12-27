import { connect } from 'react-redux'
import SketchParam from '../../components/SketchParam'
import getNodeInputLinkIds from '../../selectors/getNodeInputLinkIds'
import withDeferRender from '../../utils/withDeferRender'

const mapStateToProps = (state, ownProps) => {
  return {
    inputLinkIds: getNodeInputLinkIds(state, ownProps.nodeId)
  }
}

const ParamContainer = connect(
  mapStateToProps
)(withDeferRender(SketchParam))

export default ParamContainer
