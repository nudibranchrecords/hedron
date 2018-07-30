import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Input from '../Input'
import { Field } from 'redux-form'
import Row from '../Row'
import Col from '../Col'
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
    width: auto;

    &:focus {
      border-color: white;
    }
  }
`

class Range extends React.Component {
  
  render () {
    const{onSubmit} = this.props
    const props = this.props
    
    return (
      <Wrapper>
        <Row>
          <Col width='50%'>
            <label>Range: min</label>
            <Field component='input' name='min' type='number'/>
          </Col>
          <Col width='50%'>
            <label> max</label>
            <Field component='input' name='max' type='number' />
          </Col>
        </Row>
      </Wrapper>
    )
  }
}

Range.propTypes = {
}

export default Range
