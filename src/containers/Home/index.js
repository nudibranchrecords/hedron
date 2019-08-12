import Home from '../../components/Home'
import { projectChooseSketchesFolder, projectLoad } from '../../store/project/actions'
import { connect } from 'react-redux'

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    onChooseFolderClick: () => { dispatch(projectChooseSketchesFolder(true, true)) },
    onLoadClick: () => { dispatch(projectLoad()) },
  }
)

export default connect(
  null,
  mapDispatchToProps
)(Home)
