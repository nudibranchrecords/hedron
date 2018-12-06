import { connect } from 'react-redux'
import ProjectDetails from '../../components/ProjectDetails'
import getProjectErrorLatest from '../../selectors/getProjectErrorLatest'

const mapStateToProps = (state, ownProps) => ({
  filePath: state.project.filePath,
  errorMessage: getProjectErrorLatest(state),
})

export default connect(
  mapStateToProps,
  null,
  null,
  {
    areStatesEqual: (next, prev) =>
      next.project === prev.project &&
      next.displays === prev.displays,
  }
)(ProjectDetails)
