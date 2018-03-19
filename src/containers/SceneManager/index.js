import { connect } from 'react-redux'
import SceneManager from '../../components/SceneManager'
import getScenes from '../../selectors/getScenes'

const mapStateToProps = (state, ownProps) => (
  {
    items: getScenes(state)
  }
)

export default connect(
  mapStateToProps,
)(SceneManager)
