import { connect } from 'react-redux'
import SketchParam from '../../components/SketchParam'
import getNode from '../../selectors/getNode'
import withDeferRender from '../../utils/withDeferRender'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  return {
    inputLinkIds: node.inputLinkIds,
    numInputs: node.inputLinkIds.length,
    numMacros: node.connectedMacroIds.length
  }
}

const ParamContainer = connect(
  mapStateToProps
)(withDeferRender(SketchParam))

export default ParamContainer
