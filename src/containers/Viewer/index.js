import { connect } from 'react-redux'
import Viewer from '../../components/Viewer'
import { setViewerEl } from '../../engine/renderer'

const mapStateToProps = (state, ownProps) => (
  {
    containerElRef: (el) => setViewerEl(el)
  }
)

export default connect(
  mapStateToProps,
  null,
  null,
  {
    areStatesEqual: () => true
  }
)(Viewer)
