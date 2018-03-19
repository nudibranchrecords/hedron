import { connect } from 'react-redux'
import SketchesNav from '../../components/SketchesNav'
import { getSketches } from './selectors'
import getCurrentSceneId from '../../selectors/getCurrentSceneId'

const mapStateToProps = (state, ownProps) => (
  {
    sceneId: getCurrentSceneId(state),
    items: getSketches(state)
  }
)

export default connect(
  mapStateToProps,
  null,
  null,
  {
    areStatesEqual: (next, prev) =>
      next.sketches === prev.sketches &&
      next.router === prev.router
  }
)(SketchesNav)
