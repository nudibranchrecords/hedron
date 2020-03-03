import { connect } from 'react-redux'
import SceneList from '../../components/SceneList'
import getScenes from '../../selectors/getScenes'
import { uSceneCreate, uScenesReorder } from '../../store/scenes/actions'

const mapStateToProps = (state, ownProps) => (
  {
    items: getScenes(state),
  }
)

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    onAddClick: () => {
      dispatch(uSceneCreate())
    },
    onSortEnd: (oldIndex, newIndex) => {
      dispatch(uScenesReorder(oldIndex, newIndex))
    },
  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    areStatesEqual: (next, prev) => next.scenes === prev.scenes,
  }
)(SceneList)
