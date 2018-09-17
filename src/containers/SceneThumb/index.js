import { connect } from 'react-redux'
import SceneThumbComponent from '../../components/SceneThumb'
import { rSceneSelectCurrent } from '../../store/scenes/actions'
import getScene from '../../selectors/getScene'
import getCurrentSceneId from '../../selectors/getCurrentSceneId'
import getChannelSceneId from '../../selectors/getChannelSceneId'

const mapStateToProps = (state, ownProps) => {
  const scene = getScene(state, ownProps.id)
  const currentSceneId = getCurrentSceneId(state, ownProps.id)
  const isChannelA = getChannelSceneId(state, 'A') === ownProps.id
  const isChannelB = getChannelSceneId(state, 'B') === ownProps.id

  return {
    children: scene.title,
    isActive: ownProps.id === currentSceneId,
    channel: isChannelA && 'A' || isChannelB && 'B' || undefined,
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
