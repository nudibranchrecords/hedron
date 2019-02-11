import React from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'
import SceneHeader from '../../containers/SceneHeader'
import styled from 'styled-components'
import Revealer from '../../containers/AuxRevealer'

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

const SketchItems = ({ items, onAddClick }) => (
  <Items>
    {items.map(item =>
      <li key={item.id}>
        <Button size='large' onClick={() => onAddClick(item.id)}>{item.title}</Button>
      </li>
    )}
  </Items>
)

const AddSketch = ({ items, hasSketches, onAddClick, onChooseFolderClick, sketchesPath }) => (
  <React.Fragment>
    <SceneHeader>Add Sketch</SceneHeader>
    <CategoryHeader>Categories</CategoryHeader>
    <SketchItems items={items.looseItems} onAddClick={onAddClick} />
    {items.categorizedItems.map(catItem => (
      <Category
        title={catItem.title}
        key={catItem.id}
        auxId={`sketchcat_${catItem.id}`}
      >
        <SketchItems items={catItem.items} onAddClick={onAddClick} />
      </Category>
    ))}

    {!hasSketches && <p>You haven't chosen the sketch folder for the project yet.</p>}
    <Button onClick={onChooseFolderClick}>Choose Sketch Folder</Button>
    <br />
    {sketchesPath}
  </React.Fragment>
)

const itemsType = PropTypes.arrayOf(PropTypes.shape({
  title: PropTypes.string,
  id: PropTypes.string,
}))

AddSketch.propTypes = {
  sketchesPath: PropTypes.string,
  onAddClick: PropTypes.func.isRequired,
  onChooseFolderClick: PropTypes.func.isRequired,
  items: PropTypes.shape({
    looseItems: itemsType,
    categorizedItems: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      id: PropTypes.string,
      items: itemsType,
    })),
  }),
  hasSketches: PropTypes.bool,
}

SketchItems.propTypes = {
  items: itemsType,
  onAddClick: PropTypes.func.isRequired,
}

export default AddSketch
