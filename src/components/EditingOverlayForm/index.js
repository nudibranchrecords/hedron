import React from 'react'
import PropTypes from 'prop-types'
import Form from '../Form'
import { Field } from 'redux-form'

const EditingOverlayForm = ({ handleSubmit }) => (
  <Form onSubmit={handleSubmit}>
    <Field name='title' id='title' component='input' type='text' />
  </Form>
)

export default EditingOverlayForm

EditingOverlayForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}
