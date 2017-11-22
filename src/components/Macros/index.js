import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from '../Button'
import MacroItem from '../../containers/MacroItem'

const Wrapper = styled.div`
  padding: 0.5rem;
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: auto;
`

const Macros = ({ items, onAddClick }) => (
  <Wrapper>
    <h2>Macros</h2>
    <ul>
      {items.map(({ id }) => (
        <li key={id}>
          <MacroItem id={id} />
        </li>
      ))}
    </ul>
    <div>
      <Button size='large' onClick={onAddClick}>Add Macro</Button>
    </div>
  </Wrapper>
)

Macros.propTypes = {
  onAddClick: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string
    })
  )
}

export default Macros
