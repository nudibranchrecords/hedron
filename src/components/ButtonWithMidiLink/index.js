import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Button from '../../components/Button'
import Row from '../../components/Row'
import InputLinkMidiControl from '../../containers/InputLinkMidiControl'

const MainButton = styled(Button)`
  margin-right: 0.25rem;
`

const ButtonWithMidiLink = ({ onClick, children, linkableActionId }) =>
  <Row>
    <MainButton onClick={onClick}>{children}</MainButton>
    <InputLinkMidiControl linkableActionId={linkableActionId} />
  </Row>

ButtonWithMidiLink.propTypes = {
  linkableActionId: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
}

export default ButtonWithMidiLink
