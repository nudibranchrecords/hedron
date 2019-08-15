import { connect } from 'react-redux'
import SceneList from '../../components/SceneList'
import getScenes from '../../selectors/getScenes'
import { uSceneCreate, rScenesReorder } from '../../store/scenes/actions'

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
      dispatch(rScenesReorder(oldIndex, newIndex))
    },
  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SceneList)
