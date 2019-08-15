import React from 'react'
import DelayedSort from '../../utils/DelayedSort'
import PropTypes from 'prop-types'
import SceneThumb from '../SceneThumb'
import SceneThumbContainer from '../../containers/SceneThumb'
import styled from 'styled-components'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

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

// Using DelayedSort helper util to stop flickering
class SceneList extends DelayedSort {
  updateExternalStateAfterSort (oldIndex, newIndex) {
    this.props.onSortEnd(oldIndex, newIndex)
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
