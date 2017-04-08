import { connect } from 'react-redux'
import Save from '../../components/Save'
import * as a from './actions'

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFileChange: () => dispatch(a.saveProject())
})

export default connect(
  null,
  mapDispatchToProps
)(Save)
