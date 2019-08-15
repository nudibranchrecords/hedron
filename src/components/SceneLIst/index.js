import React from 'react'
import PropTypes from 'prop-types'
import SceneThumb from '../SceneThumb'
import SceneThumbContainer from '../../containers/SceneThumb'
import styled from 'styled-components'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'

const Wrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;

  > li {
    width: 12.5%;
  } 
`

const SortableItem = SortableElement(({ item }) =>
  <li><SceneThumbContainer key={item.id} id={item.id} /></li>
)

const SortableList = SortableContainer(({ items, onAddClick }) =>
  <Wrapper>
    {items.map((item, index) => (
      <SortableItem
        key={item.id}
        index={index}
        item={item}
      />
    ))}
    <li><SceneThumb onClick={onAddClick}>+</SceneThumb></li>
  </Wrapper>
)

// This sketch can't be stateless because of the reordering
// Reordering works stateless, but with some annoying flickering
// It's quite a bit of work just to stop a tiny little thing, but it was annoying!
// https://github.com/clauderic/react-sortable-hoc/issues/280
class SceneList extends React.Component {
  state = {
    items: this.props.items,
  }

  // We update both internal and external state onSortEnd
  handleOnSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ items }) => ({
      items: arrayMove(items, oldIndex, newIndex),
    }))
    // This wont affect the rendering of the component but we need to store the state properly in redux!
    this.props.onSortEnd(oldIndex, newIndex)
  }

  // We update the state based on props if the scene has changed or an item has been added/deleted
  // If only the order has changed, it will just use the internal state (stops the flickering)
  static getDerivedStateFromProps (props, state) {
    if (
      props.items && state.items && props.items.length !== state.items.length // has an item been added or removed?
    ) {
      return {
        items: props.items,
      }
    }
    return null
  }

  render () {
    return <SortableList
      {...this.props}
      items={this.state.items}
      helperClass='is-sorting'
      pressDelay={300}
      axis='xy'
      onSortEnd={this.handleOnSortEnd}
    />
  }
}

SceneList.propTypes = {
  onSortEnd: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    })
  ),
}

export default SceneList
