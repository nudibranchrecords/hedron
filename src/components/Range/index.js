import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'redux-form'
import Row from '../Row'
import Col from '../Col'
import theme from '../../utils/theme'
import Button from '../Button'

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
    width: auto;

    &:focus {
      border-color: white;
    }
  }
`

class Range extends React.Component {

  onKeyPress = (e) => {
    if (e.key === 'Enter') { this.props.handleSubmit() }
  }

  onClick = (e) => {
    this.props.handleSubmit()
  }
  render () {
    const { min, max } = this.props.initialValues

    return (
      <Wrapper>
        <Row>
          <Col width='45%'>
            <label>Range: min {min}</label>
            <Field component='input' name='min' type='number' onKeyPress={this.onKeyPress} />
          </Col>
          <Col width='45%'>
            <label> max {max}</label>
            <Field component='input' name='max' type='number' onKeyPress={this.onKeyPress} />
          </Col>
          <Button type='submit' onClick={this.onClick}>Set</Button>
        </Row>
      </Wrapper>
    )
  }
}

Range.propTypes = {
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object
}

export default Range
