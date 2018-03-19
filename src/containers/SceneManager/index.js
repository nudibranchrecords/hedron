import { connect } from 'react-redux'
import SceneManager from '../../components/SceneManager'
import getScenes from '../../selectors/getScenes'
import { uSceneCreate } from '../../store/scenes/actions'

const mapStateToProps = (state, ownProps) => (
  {
    items: getScenes(state)
  }
)

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    onAddClick: () => {
      dispatch(uSceneCreate())
    }
  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SceneManager)
