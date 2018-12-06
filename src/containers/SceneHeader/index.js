import { connect } from 'react-redux'
import ViewHeader from '../../components/ViewHeader'
import getCurrentScene from '../../selectors/getCurrentScene'

const mapStateToProps = (state, ownProps) => {
  const scene = getCurrentScene(state)
  return {
    children: `${scene.title}: ${ownProps.children}`,
  }
}

export default connect(
  mapStateToProps,
)(ViewHeader)
