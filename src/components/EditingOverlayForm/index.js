import React from 'react'
import PropTypes from 'prop-types'
import Form from '../Form'
import { Field } from 'redux-form'

class EditingOverlayForm extends React.Component {
  componentDidMount () {
    document.querySelector('#editing_title').focus()
  }

  render () {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <Field name='title' id='editing_title' component='input' type='text' />
      </Form>
    )
  }
}

EditingOverlayForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default EditingOverlayForm
