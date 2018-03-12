import React from 'react'
import PropTypes from 'prop-types'
import Input from '../Input'

class ParamvalueForm extends React.Component {
  componentDidMount () {
    document.querySelector('#editing_param').focus()
  }

  render () {
    const { handleSubmit, label } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <Input name='paramValue' id='editing_param' label={label} />
      </form>
    )
  }
}

ParamvalueForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
}

export default ParamvalueForm
