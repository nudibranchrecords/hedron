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

const MainViewOuter = (
  { children, notificationText, notificationButtonText, isActive,
    onNotificationButtonClick }
) => (
  <Wrapper isActive={isActive}>
    {notificationText &&
      <Notification>
        {notificationText}
        <Button onClick={onNotificationButtonClick} reversed>
          {notificationButtonText}
        </Button>
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
  notificationButtonText: PropTypes.string,
  onNotificationButtonClick: PropTypes.func,
  isActive: PropTypes.bool,
}
