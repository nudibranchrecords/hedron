import { connect } from 'react-redux'
import Save from '../../components/Save'
import * as a from './actions'

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFileChange: (event) => dispatch(a.saveProject(event.target.value))
})

export default connect(
  null,
  mapDispatchToProps
)(Save)
