import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../utils/theme'
import ButtonComponent from '../Button'

const Button = styled(ButtonComponent)`
  margin-left: 1rem;
`

const Wrapper = styled.h1`
  font-weight: normal;
  font-size: 1.2rem;
  background: ${theme.bgColorDark2};
  padding: 0.5rem;
  flex: 0 0 2rem;
  margin: -0.5rem -0.5rem 0.5rem;
  border-bottom: 1px solid ${theme.lineColor2};
  color: ${theme.textColorLight1};
  display: flex;
  align-items: center;
`

const ViewHeader = ({ children, onButtonClick, buttonText }) => (
  <Wrapper>
    {children}
    {onButtonClick &&
      <Button size='small' onClick={onButtonClick}>{buttonText}</Button>
    }
  </Wrapper>
)

ViewHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func,
  buttonText: PropTypes.string,
}

export default ViewHeader
