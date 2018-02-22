import { connect } from 'react-redux'
import EditingOverlayFormComponent from '../../components/EditingOverlayForm'
import { uiEditingClose } from '../../store/ui/actions'
import { nodeTitleUpdate } from '../../store/nodes/actions'
import { sketchTitleUpdate } from '../../store/sketches/actions'
import getUiIsEditingNode from '../../selectors/getUiIsEditingNode'
import { reduxForm } from 'redux-form'

const mapStateToProps = (state, ownProps) => {
  const node = getUiIsEditingNode(state)

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
    switch (ownProps.type) {
      case 'nodeTitle':
        dispatch(nodeTitleUpdate(ownProps.id, values.title))
        break
      case 'sketchTitle':
        dispatch(sketchTitleUpdate(ownProps.id, values.title))
        break
    }
  }
})

const EditingOverlayForm = reduxForm({
  form: 'editingOverlay'
})(EditingOverlayFormComponent)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditingOverlayForm)
