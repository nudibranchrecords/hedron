import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'redux-form'
import Row from '../Row'
import theme from '../../utils/theme'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.7rem;
  padding: 0px;
  padding-bottom: .2rem;

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

  onKeyPress = (e) => {
    if (e.key === 'Enter') { this.props.handleSubmit() }
  }
  onBlur = (e) => {
    this.props.handleSubmit()
  }

  render () {
    return (
      <Wrapper>
        <h4>Range</h4>
        <Row>
          <Col>
            <label>Min</label>
            <Field component='input' name='min' type='number' onKeyPress={this.onKeyPress} onBlur={this.onBlur} />
          </Col>
          <Col>
            <label>Max</label>
            <Field component='input' name='max' type='number' onKeyPress={this.onKeyPress} onBlur={this.onBlur} />
          </Col>
        </Row>
      </Wrapper>
    )
  }
}

ParamRange.propTypes = {
  handleSubmit: PropTypes.func
}

export default ParamRange
