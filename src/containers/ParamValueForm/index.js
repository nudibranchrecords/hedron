import { connect } from 'react-redux'
import ParamValueFormComponent from '../../components/ParamValueForm'
import { uiEditingClose } from '../../store/ui/actions'
import { nodeValueUpdate } from '../../store/nodes/actions'
import getUiIsEditingNode from '../../selectors/getUiIsEditingNode'
import { reduxForm } from 'redux-form'

const mapStateToProps = (state, ownProps) => {
  const node = getUiIsEditingNode(state)

  return {
    initialValues: {
      paramValue: node.value
    },
    label: node.title,
    enableReinitialize: true
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (values) => {
    dispatch(uiEditingClose())
    dispatch(nodeValueUpdate(ownProps.id, values.paramValue))
  },
  onBlur: () => {
    dispatch(uiEditingClose())
  }
})

const ParamValueForm = reduxForm({
  form: 'paramValue'
})(ParamValueFormComponent)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParamValueForm)
