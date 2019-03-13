import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Button from '../../components/Button'
import Row from '../../components/Row'
import NodeInputIcons from '../../containers/NodeInputIcons'

const MainButton = styled(Button)`
  margin-right: 0.25rem;
`

const ButtonWithInputIcons = ({ onClick, children, linkableActionId }) => (
  <Row>
    <MainButton onClick={onClick}>{children}</MainButton>
    <NodeInputIcons nodeId={linkableActionId} size='compact' />
  </Row>
)

ButtonWithInputIcons.propTypes = {
  linkableActionId: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
}

export default ButtonWithInputIcons
