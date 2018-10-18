import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from '../Button'
import ViewHeader from '../ViewHeader'
import Items from '../Items'
import Item from '../Item'
import MacroItem from '../../containers/MacroItem'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`

const Macros = ({ items, onAddClick }) => (
  <Wrapper>
    <ViewHeader>Macros</ViewHeader>
    <Items>
      {items.map(({ id }) => (
        <Item key={id}>
          <MacroItem id={id} />
        </Item>
      ))}
    </Items>
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
      title: PropTypes.string,
    })
  ),
}

export default Macros
