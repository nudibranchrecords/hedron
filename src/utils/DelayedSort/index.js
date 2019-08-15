import React from 'react'
import PropTypes from 'prop-types'
import arrayMove from 'array-move'

// Fixes flickering with react-sortable-hoc, by using state instead of props
// State always gets updated by props apart from a small period after reordering has happened,
// where prop changes are ignored, to stop flickering
// https://github.com/clauderic/react-sortable-hoc/issues/280
class DelayedSort extends React.Component {
  state = {
    deriveProps: true,
    items: this.props.items,
  }

  // We update both internal and external state onSortEnd
  handleOnSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ items }) => ({
      deriveProps: false, // Temporarily stop props affecting state
      items: arrayMove(items, oldIndex, newIndex),
    }))

    this.updateExternalStateAfterSort(oldIndex, newIndex)

    // After a very short wait, allow props to affect state again
    setTimeout(() => {
      this.setState(() => ({
        deriveProps: true,
      }))
    }, 10)
  }

  // Update state with prop changes, except for a brief period after the order has changed,
  // to stop flickering from happening
  static getDerivedStateFromProps (props, state) {
    if (state.deriveProps) {
      return {
        items: props.items,
      }
    }
    return null
  }
}

DelayedSort.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    })
  ),
}

export default DelayedSort
