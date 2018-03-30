import { connect } from 'react-redux'
import SceneManager from '../../components/SceneManager'
import getScenes from '../../selectors/getScenes'
import getCurrentScene from '../../selectors/getCurrentScene'
import { uSceneCreate, uSceneDelete } from '../../store/scenes/actions'
import { uiEditingOpen } from '../../store/ui/actions'

const mapStateToProps = (state, ownProps) => (
  {
    items: getScenes(state),
    currentScene: getCurrentScene(state)
  }
)

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    onAddClick: () => {
      dispatch(uSceneCreate())
    },
    onDeleteClick: sceneId => {
      dispatch(uSceneDelete(sceneId))
    },
    onRenameClick: sceneId => {
      dispatch(uiEditingOpen('sceneTitle', sceneId))
    }
  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SceneManager)
