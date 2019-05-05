import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'redux-form'
import Row from '../Row'
import theme from '../../utils/theme'
import Button from '../Button'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.7rem;
  padding: 0;
  margin-bottom: .5rem;

  input {
      font-size: .7rem;
      display: block;
      border: 1px solid #aaa;
      background: ${theme.bgColorDark2};
      color: white;
      padding: 0.1rem;
      outline: none;
      max-width: 5rem;

      &:focus {
        border-color: white;
      }
    }
`

const Col = styled.div`
  margin-right: 1rem;
`

class ParamRange extends React.Component {

  constructor (props) {
    super(props)

    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') { this.props.handleSubmit() }
  }

  handleBlur () {
    this.props.handleSubmit()
  }

  render () {
    return (
      <Wrapper>
        <h4>Range</h4>
        <Row align='flex-end'>
          <Col>
            <label>Min</label>
            <Field
              component='input' name='min' type='number'
              onKeyPress={this.handleKeyPress} onBlur={this.handleBlur}
            />
          </Col>
          <Col>
            <label>Max</label>
            <Field
              component='input' name='max' type='number'
              onKeyPress={this.handleKeyPress} onBlur={this.handleBlur}
            />
          </Col>
          <Button onClick={this.props.onResetClick}>Reset Range</Button>
        </Row>
      </Wrapper>
    )
  }
}

ParamRange.propTypes = {
  handleSubmit: PropTypes.func,
  onResetClick: PropTypes.func.isRequired,
}

export default ParamRange
