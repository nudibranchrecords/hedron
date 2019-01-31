import React from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'
import SceneHeader from '../../containers/SceneHeader'
import styled from 'styled-components'
import Revealer from '../../components/Revealer'

const CategoryHeader = styled.p`
  font-size:1.7em;
  margin-bottom: .5rem;
`
const Category = styled(Revealer)`
  font-size:1.5em;
  margin-bottom: .5rem;
`
const Items = styled.ul`
  display: flex;
  flex-wrap: wrap;

  & li {
    margin-right: 1rem;
    margin-bottom: 1rem;
  }
`

class AddSketch extends React.Component {// =
  constructor () {
    super()
    this.state = {
      open:{},
    }
  }

  OnExpand (key) {
    let open = this.state.open
    open[key] = !open[key]
    this.setState({
      open:open,
    })
    this.props.onExpandField(key)
  }

  render () {
    const { items, onAddClick, onChooseFolderClick, sketchesPath } = this.props
    let sections = {}
    let open = this.state.open

    // step through all items, define the buttons and create a section if it doesn't currently exist
    for (let item of items) {
      const button = (<li key={item.id}>
        <Button size='large' onClick={() => onAddClick(item.id)}>{item.title}</Button>
      </li>)

      // this could change to multiple things down the line (category, author, year, path, etc)
      const key = item.category
      if (!sections[key]) {
        sections[key] = { children:[], key:key }
        // need to move this out of the render function, needs to have more perminance
        if (open[key] === undefined) { open[key] = false }
      }
      sections[key].children.push(button)
    }

    // create the section elements after all their children have been organized
    const sectionsFragment = []
    for (let key in sections) {
      sectionsFragment.push(<Category tag={'h2'} title={key} isOpen={this.state.open[key]} onHeaderClick={() => {
        this.OnExpand(key)
      }}><Items> {sections[key].children} </Items></Category>)
    }

    // saving the state
    if (open !== this.state.open) {
      this.setState({
        open:open,
      })
    }

    return (
      <React.Fragment>
        <SceneHeader>Add Sketch</SceneHeader>
        <CategoryHeader>Categories</CategoryHeader>
        {sectionsFragment}
        {items.length === 0 && <p>You haven't chosen the sketch folder for the project yet.</p>}
        <Button onClick={onChooseFolderClick}>Choose Sketch Folder</Button>
        <br />
        {sketchesPath}
      </React.Fragment>
    )
  }
}

AddSketch.propTypes = {
  sketchesPath: PropTypes.string,
  onAddClick: PropTypes.func.isRequired,
  onChooseFolderClick: PropTypes.func.isRequired,
  onExpandField: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      id: PropTypes.string,
    })
  ).isRequired,
}

export default AddSketch
