import { connect } from 'react-redux'
import EditingOverlay from '../../components/EditingOverlay'
import { uiEditingClose } from '../../store/ui/actions'
import getNode from '../../selectors/getNode'

const mapStateToProps = (state, ownProps) => {
  const isEditing = state.ui.isEditing
  const node = isEditing && getNode(state, isEditing.id)

  return {
    id: isEditing && isEditing.id,
    isVisible: isEditing !== false,
    title: `Editing: ${node.title}`
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onCancelClick: () => {
    dispatch(uiEditingClose())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditingOverlay)
