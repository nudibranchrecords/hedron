import Home from '../../components/Home'
import { projectChooseSketchesFolder } from '../../store/project/actions'
import { connect } from 'react-redux'

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    onChooseFolderClick: () => { dispatch(projectChooseSketchesFolder()) }
  }
)

export default connect(
  null,
  mapDispatchToProps
)(Home)
