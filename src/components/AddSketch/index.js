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
  constructor (props) {
    super(props)
    const sections = {}
    for (let item of props.items) {
      if (sections[item.category] === undefined) {
        sections[item.category] = { open: false, children:[] }
      }
      sections[item.category].children.push(<li key={item.id}>
        <Button size='large' onClick={() => props.onAddClick(item.id)}>{item.title}</Button>
      </li>)
    }
    this.state = { sections:sections }
  }

  OnExpand (key) {
    let sections = this.state.sections
    sections[key].open = !sections[key].open
    this.setState({
      sections:sections,
    })
    this.props.onExpandField(key)
  }

  render () {
    const { items, onChooseFolderClick, sketchesPath } = this.props

    const sectionElements = []
    for (let key in this.state.sections) {
      sectionElements.push(<Category tag={'h2'} title={key} isOpen={this.state.sections[key].open} onHeaderClick={() => {
        this.OnExpand(key)
      }}><Items> { this.state.sections[key].children} </Items></Category>)
    }

    return (
      <React.Fragment>
        <SceneHeader>Add Sketch</SceneHeader>
        <CategoryHeader>Categories</CategoryHeader>
        {sectionElements}
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
