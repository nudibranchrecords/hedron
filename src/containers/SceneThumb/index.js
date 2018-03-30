import { connect } from 'react-redux'
import SceneThumbComponent from '../../components/SceneThumb'
import { rSceneSelectCurrent } from '../../store/scenes/actions'
import getScene from '../../selectors/getScene'
import getCurrentSceneId from '../../selectors/getCurrentSceneId'

const mapStateToProps = (state, ownProps) => {
  const scene = getScene(state, ownProps.id)
  const currentSceneId = getCurrentSceneId(state, ownProps.id)
  return {
    children: scene.title,
    isActive: scene.id === currentSceneId,
    to: '/scenes/view'
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => { dispatch(rSceneSelectCurrent(ownProps.id)) }
})

const SceneThumb = connect(
  mapStateToProps,
  mapDispatchToProps
)(SceneThumbComponent)

export default SceneThumb
