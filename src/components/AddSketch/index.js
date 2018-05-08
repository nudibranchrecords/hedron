import React from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'
import SceneHeader from '../../containers/SceneHeader'
import styled from 'styled-components'

const Items = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 2rem;

  & li {
    margin-right: 1rem;
    margin-bottom: 1rem;
  }
`

const AddSketch = ({ items, onAddClick, onChooseFolderClick, sketchesPath }) => (
  <div>
    <SceneHeader>Add Sketch</SceneHeader>
    <Items>
      {items.map((item) => (
        <li key={item.id}>
          <Button size='large' onClick={() => onAddClick(item.id)}>{item.title}</Button>
        </li>
      ))}
    </Items>
    {items.length === 0 && <p>You haven't chosen the sketch folder for the project yet.</p>}
    <Button onClick={onChooseFolderClick}>Choose Sketch Folder</Button>
    <br />
    {sketchesPath}
  </div>
)

AddSketch.propTypes = {
  sketchesPath: PropTypes.string,
  onAddClick: PropTypes.func.isRequired,
  onChooseFolderClick: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      id: PropTypes.string
    })
  ).isRequired
}

export default AddSketch
