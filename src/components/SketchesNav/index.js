import React from 'react'
import PropTypes from 'prop-types'
import NavItem from '../NavItem'
import styled from 'styled-components'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

const Wrapper = styled.nav`
  margin-bottom: 2rem;
`

const SortableItem = SortableElement(({ item, sceneId, currentSketchId, onNavItemClick }) =>
  <li>
    <NavItem
      isActive={item.id === currentSketchId}
      onClick={() => { onNavItemClick(sceneId, item.id) }}
    >
      {item.title}
    </NavItem>
  </li>
)

const SortableList = SortableContainer(({ items, ...props }) =>
  <ul>
    {items.map((item, index) => (
      <SortableItem
        key={item.id}
        index={index}
        item={item}
        {...props}
      />
    ))}
  </ul>
)

const SketchesNav = ({ onSortEnd, ...props }) => (
  <Wrapper>
    <SortableList
      helperClass='is-sorting'
      pressDelay={300}
      lockAxis='y'
      onSortEnd={({ oldIndex, newIndex }) => { onSortEnd(props.sceneId, oldIndex, newIndex) }}
      {...props}
    />
    <NavItem className='last' to={`/scenes/addSketch/${props.sceneId}`}>+</NavItem>
  </Wrapper>
)

SketchesNav.propTypes = {
  currentSketchId: PropTypes.oneOfType([
    PropTypes.string, PropTypes.bool,
  ]).isRequired,
  sceneId: PropTypes.string.isRequired,
  onNavItemClick: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    })
  ),
}

export default SketchesNav
