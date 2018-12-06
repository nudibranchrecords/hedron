import { connect } from 'react-redux'
import SketchesNav from '../../components/SketchesNav'
import getCurrentSketches from '../../selectors/getCurrentSketches'
import getCurrentSceneId from '../../selectors/getCurrentSceneId'
import { sceneSketchSelect } from '../../store/scenes/actions'
import getSelectedSketchId from '../../selectors/getSelectedSketchId'

const mapStateToProps = (state, ownProps) => {
  const page = state.router.location.pathname.split('/')[2]
  return {
    sceneId: getCurrentSceneId(state),
    items: getCurrentSketches(state),
    currentSketchId: page === 'addSketch' ? false : getSelectedSketchId(state),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onNavItemClick: (sceneId, itemId) => {
    dispatch(sceneSketchSelect(sceneId, itemId))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    areStatesEqual: (next, prev) =>
      next.sketches === prev.sketches &&
      next.scenes === prev.scenes &&
      next.router === prev.router,
  }
)(SketchesNav)
