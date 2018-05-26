import React from 'react'
import PropTypes from 'prop-types'
import Input from '../Input'
import paramValue from '../../utils/fieldNormalizers/paramValue'

class ParamvalueForm extends React.Component {
  componentDidMount () {
    const input = document.querySelector('#editing_param')
    input.focus()

    // If value is 1 or 0, select whole numnber
    if (input.value === '1' || input.value === '0') {
      input.select()
    } else {
    // If value is decimal, select digits after decimal place
      input.setSelectionRange(2, 5)
    }
  }

  render () {
    const { handleSubmit, onBlur } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <Input
          name='paramValue'
          id='editing_param'
          normalize={paramValue}
          onBlur={onBlur}
        />
      </form>
    )
  }
}

ParamvalueForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
}

export default ParamvalueForm
