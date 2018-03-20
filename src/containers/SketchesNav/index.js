import { connect } from 'react-redux'
import SketchesNav from '../../components/SketchesNav'
import getCurrentSketches from '../../selectors/getCurrentSketches'
import getCurrentSceneId from '../../selectors/getCurrentSceneId'
import { sceneSketchSelect } from '../../store/scenes/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    sceneId: getCurrentSceneId(state),
    items: getCurrentSketches(state)
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
