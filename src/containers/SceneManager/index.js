import { connect } from 'react-redux'
import SceneManager from '../../components/SceneManager'
import getCurrentScene from '../../selectors/getCurrentScene'
import getCurrentSceneId from '../../selectors/getCurrentSceneId'
import {
  uSceneDelete, uSceneSelectChannel, sceneClearChannel,
}
  from '../../store/scenes/actions'
import { uiEditingOpen } from '../../store/ui/actions'

const mapStateToProps = (state, ownProps) => ({
  currentScene: getCurrentScene(state),
})

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    onDeleteClick: sceneId => {
      dispatch(uSceneDelete(sceneId))
    },
    onClearClick: sceneId => {
      dispatch(sceneClearChannel(sceneId))
    },
    onActiveClick: sceneId => {
      dispatch(uSceneSelectChannel(sceneId, 'active'))
    },
    onOppositeClick: sceneId => {
      dispatch(uSceneSelectChannel(sceneId, 'opposite'))
    },
    onRenameClick: sceneId => {
      dispatch(uiEditingOpen('sceneTitle', sceneId))
    },
    onChannelClick: (sceneId, channel) => {
      dispatch(uSceneSelectChannel(sceneId, channel))
    },
  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    areStatesEqual: (next, prev) => getCurrentSceneId(next) === getCurrentSceneId(prev),
  }
)(SceneManager)
