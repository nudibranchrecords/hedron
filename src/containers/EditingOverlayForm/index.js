import { connect } from 'react-redux'
import EditingOverlayFormComponent from '../../components/EditingOverlayForm'
import { uiEditingClose } from '../../store/ui/actions'
import { nodeTitleUpdate } from '../../store/nodes/actions'
import getNode from '../../selectors/getNode'
import { reduxForm } from 'redux-form'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.id)

  return {
    initialValues: {
      title: node.title
    },
    enableReinitialize: true
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (values) => {
    dispatch(uiEditingClose())
    dispatch(nodeTitleUpdate(ownProps.id, values.title))
  }
})

const EditingOverlayForm = reduxForm({
  form: 'editingOverlay'
})(EditingOverlayFormComponent)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditingOverlayForm)
