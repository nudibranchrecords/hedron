import { connect } from 'react-redux'
import EditingOverlayFormComponent from '../../components/EditingOverlayForm'
import { uiEditingClose } from '../../store/ui/actions'
import { nodeUpdate } from '../../store/nodes/actions'
import { sketchUpdate } from '../../store/sketches/actions'
import { sceneRename } from '../../store/scenes/actions'
import getUiIsEditingNode from '../../selectors/getUiIsEditingNode'
import { reduxForm } from 'redux-form'

const mapStateToProps = (state, ownProps) => {
  const node = getUiIsEditingNode(state)

  return {
    initialValues: {
      title: node.title,
    },
    enableReinitialize: true,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (values) => {
    dispatch(uiEditingClose())
    switch (ownProps.type) {
      case 'nodeTitle':
        dispatch(nodeUpdate(ownProps.id, { title: values.title }))
        break
      case 'sketchTitle':
        dispatch(sketchUpdate(ownProps.id, { title: values.title }))
        break
      case 'sceneTitle':
        dispatch(sceneRename(ownProps.id, values.title))
        break
    }
  },
})

const EditingOverlayForm = reduxForm({
  form: 'editingOverlay',
})(EditingOverlayFormComponent)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditingOverlayForm)
