import { connect } from 'react-redux'
import EditingOverlay from '../../components/EditingOverlay'
import { uiEditingClose } from '../../store/ui/actions'

const mapStateToProps = (state, ownProps) => ({
  isVisible: state.ui.isEditing !== false
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onCancelClick: () => {
    dispatch(uiEditingClose())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditingOverlay)
