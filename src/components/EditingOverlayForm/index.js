import React from 'react'
import PropTypes from 'prop-types'
import Input from '../Input'

class EditingOverlayForm extends React.Component {
  componentDidMount () {
    document.querySelector('#editing_title').select()
  }

  render () {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Input name='title' id='editing_title' />
      </form>
    )
  }
}

EditingOverlayForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default EditingOverlayForm
