import React from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'
import SceneHeader from '../../containers/SceneHeader'
import styled from 'styled-components'
import Revealer from '../../containers/AuxRevealer'
import Control from '../../containers/Control'

const Category = styled(Revealer)`
  font-size:1rem;
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
const Main = styled.div`
  margin-left: 1rem;
  margin-top: 1rem;
`

const SketchesPath = styled.p`
  margin-top: 1rem;
  user-select: text;
`

const SketchItems = ({ subcategories, items, onAddClick }) => (
  <Main>
    {(subcategories !== undefined) && subcategories.map(category =>
      <Category
        title={category.title}
        key={category.id}
        auxId={`sketchcat_${category.id}`}
      >
        <SketchItems subcategories={category.categories} items={category.items} onAddClick={onAddClick} />
      </Category>
    )}
    <Items>
      {items.map(item =>
        <li key={item.id}>
          <Button size='large' onClick={() => onAddClick(item.id)}>{item.title}</Button>
        </li>
      )}
    </Items>
  </Main>
)

const AddSketch = ({ items, hasSketches, onAddClick, onChooseFolderClick, sketchesPath }) => (
  <React.Fragment>
    <SceneHeader>Add Sketch</SceneHeader>
    <Control nodeId='sketchOrganization' />
    <SketchItems items={items.looseItems} onAddClick={onAddClick} />
    {items.categorizedItems[0].categories.map((catItem) =>
      <Category
        title={catItem.title}
        key={catItem.id}
        auxId={`sketchcat_${catItem.id}`}
      >
        <SketchItems subcategories={catItem.categories} items={catItem.items} onAddClick={onAddClick} />
      </Category>
    )}

    {!hasSketches && <p>You haven't chosen the sketches folder for the project yet.</p>}
    <Button onClick={onChooseFolderClick}>Choose Sketches Folder</Button>
    <SketchesPath>{sketchesPath}</SketchesPath>

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
      categories: PropTypes.array,
    })),
  }),
  hasSketches: PropTypes.bool,
}

SketchItems.propTypes = {
  subcategories: PropTypes.array,
  items: itemsType,
  onAddClick: PropTypes.func.isRequired,
}

export default AddSketch
