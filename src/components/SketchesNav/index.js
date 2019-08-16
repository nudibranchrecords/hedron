import React from 'react'
import DelayedSort from '../../utils/DelayedSort'
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

// Using DelayedSort helper util to stop flickering
class SketchesNav extends DelayedSort {
  updateExternalStateAfterSort (oldIndex, newIndex) {
    this.props.onSortEnd(this.props.sceneId, oldIndex, newIndex)
  }

  render () {
    return <Wrapper>
      <SortableList
        {...this.props}
        items={this.state.items}
        helperClass='is-sorting'
        pressDelay={300}
        lockAxis='y'
        onSortEnd={this.handleOnSortEnd}
      />
      <NavItem className='last' to={`/scenes/addSketch/${this.props.sceneId}`}>+</NavItem>
    </Wrapper>
  }
}

SketchesNav.propTypes = {
  sceneId: PropTypes.string.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    })
  ),
}

export default SketchesNav
