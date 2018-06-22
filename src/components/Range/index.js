import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Input from '../Input'
import Row from '../Row'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.7rem;
`

const Range = ({ min, max }) => (
  <Wrapper>
    <Row>
      <span>Range: min {min}</span>
      <Input name='min' type='number' value={min} />
      <span>max {max}</span>
      <Input name='max' type='number' value={max} />
    </Row>
  </Wrapper>
)

Range.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired
}

export default Range
