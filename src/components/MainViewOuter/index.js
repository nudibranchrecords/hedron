import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../utils/theme'
import Button from '../Button'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  ${props => props.isActive && `
    border: 3px solid ${theme.actionColor1};
  `}
`

const Inner = styled.div`
  flex: 1;
  padding: 0.5rem;
  overflow: auto;
`

const Notification = styled.div`
  background: ${theme.actionColor1};
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Buttons = styled.div`
  display: flex;
  flex-direction: row-reverse;

  > * {
    margin-left: 0.5rem;
  }
`

const MainViewOuter = (
  { children, notificationText, isActive, buttons }
) => (
  <Wrapper isActive={isActive}>
    {notificationText &&
      <Notification>
        {notificationText}
        <Buttons>
          {buttons.map(({ text, onClick }, index) =>
            <Button onClick={onClick} reversed key={index}>
              {text}
            </Button>
          )}
        </Buttons>
      </Notification>
    }
    <Inner>
      {children}
    </Inner>
  </Wrapper>
)

export default MainViewOuter

MainViewOuter.propTypes = {
  children: PropTypes.node.isRequired,
  notificationText: PropTypes.string,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ),
  isActive: PropTypes.bool,
}
