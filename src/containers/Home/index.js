import Home from '../../components/Home'
import { connect } from 'react-redux'

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    onChooseFolderClick: () => {}
  }
)

export default connect(
  null,
  mapDispatchToProps
)(Home)
