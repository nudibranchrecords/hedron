import { connect } from 'react-redux'
import Viewer from '../../components/Viewer'
import renderer from '../../engine/renderer'

const mapStateToProps = (state, ownProps) => (
  {
    containerElRef: (el) => renderer.setViewerEl(el)
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
