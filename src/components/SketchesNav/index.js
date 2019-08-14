import React from 'react'
import PropTypes from 'prop-types'
import NavItem from '../NavItem'
import styled from 'styled-components'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'

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

// This sketch can't be stateless because of the reordering
// Reordering works stateless, but with some annoying flickering
// It's quite a bit of work just to stop a tiny little thing, but it was annoying!
// https://github.com/clauderic/react-sortable-hoc/issues/280
class SketchesNav extends React.Component {
  state = {
    items: this.props.items,
    sceneId: this.props.sceneId,
  }

  // We update both internal and external state onSortEnd
  handleOnSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ items }) => ({
      items: arrayMove(items, oldIndex, newIndex),
    }))
    // This wont affect the rendering of the component but we need to store the state properly in redux!
    this.props.onSortEnd(this.props.sceneId, oldIndex, newIndex)
  }

  // We update the state based on props if the scene has changed or an item has been added/deleted
  // If only the order has changed, it will just use the internal state (stops the flickering)
  static getDerivedStateFromProps (props, state) {
    if (
      (props.sceneId !== state.sceneId) || // has the scene changed?
      (props.items && state.items && props.items.length !== state.items.length) // has an item been added or removed?
    ) {
      return {
        items: props.items,
        sceneId: props.sceneId,
      }
    }
    return null
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
