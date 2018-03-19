import { connect } from 'react-redux'
import SketchesNav from '../../components/SketchesNav'
import { getSketches } from './selectors'
import getCurrentSceneId from '../../selectors/getCurrentSceneId'
import { sceneSketchSelect } from '../../store/scenes/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    sceneId: getCurrentSceneId(state),
    items: getSketches(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onNavItemClick: (sceneId, itemId) => {
    dispatch(sceneSketchSelect(sceneId, itemId))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    areStatesEqual: (next, prev) =>
      next.sketches === prev.sketches &&
      next.router === prev.router
  }
)(SketchesNav)
