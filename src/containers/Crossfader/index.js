import { connect } from 'react-redux'
import Crossfader from '../../components/Crossfader'
import getScene from '../../selectors/getScene'
import getChannelSceneId from '../../selectors/getChannelSceneId'
import { nodeValueUpdate } from '../../store/nodes/actions'

const mapStateToProps = (state, ownProps) => {
  const a = getChannelSceneId(state, 'A')
  const b = getChannelSceneId(state, 'B')
  const sceneA = getScene(state, a)
  const sceneB = getScene(state, b)

  return {
    titleA: sceneA && sceneA.title,
    titleB: sceneB && sceneB.title,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClickA: () => {
    dispatch(nodeValueUpdate('sceneCrossfader', 0))
  },
  onClickB: () => {
    dispatch(nodeValueUpdate('sceneCrossfader', 1))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Crossfader)
