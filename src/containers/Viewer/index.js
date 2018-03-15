import { connect } from 'react-redux'
import Viewer from '../../components/Viewer'
import world from '../../engine/world'

const mapStateToProps = (state, ownProps) => (
  {
    containerElRef: (el) => world.setViewerEl(el)
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
