import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import BankSelectItem from '../../containers/BankSelectItem'

const List = styled.ul`
  display: flex;
  justify-content: space-between;
`

const BankSelect = ({ deviceId }) => (
  <List>
    {[...Array(8)].map((x, i) =>
      <BankSelectItem index={i} id={deviceId} key={i} />
    )}
  </List>
)

BankSelect.propTypes = {
  deviceId: PropTypes.string.isRequired,
}

export default BankSelect
