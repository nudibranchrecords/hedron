import { connect } from 'react-redux'
import SketchParam from '../../components/SketchParam'
import withDeferRender from '../../utils/withDeferRender'
import getNode from '../../selectors/getNode'

const mapStateToProps = (state, ownProps) => ({
  auxRevealerId: ownProps.nodeId,
  isHidden: getNode(state, ownProps.nodeId).hidden,
})

export default connect(
  mapStateToProps,
  null
)(withDeferRender(SketchParam))
