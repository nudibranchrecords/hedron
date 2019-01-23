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
  }

  render () {
    const { items, onAddClick, onChooseFolderClick, sketchesPath, onExpandField } = this.props
    let categories = {}
    let open = this.state.open
    for (let i = 0; i < items.length; i++) {
      if (!categories[items[i].category]) {
        categories[items[i].category] = []
        if (open[items[i].category] === undefined) { open[items[i].category] = false }
      }
      categories[items[i].category].push(items[i])
    }
    if (open !== this.state.open) {
      this.setState({
        open:open,
      })
    }
    return (
      <React.Fragment>
        <SceneHeader>Add Sketch</SceneHeader>
        <CategoryHeader>Categories</CategoryHeader>
        {Object.keys(categories).map((key) => (
          <React.Fragment>
            <Category tag={'h2'} title={key} isOpen={this.state.open[key]} onHeaderClick={() => {
              this.OnExpand(key); onExpandField(key)
            }}>
              <Items>
                {categories[key].map((item) => (
                  <li key={item.id}>
                    <Button size='large' onClick={() => onAddClick(item.id)}>{item.title}</Button>
                  </li>
                ))}
              </Items>
            </Category>
          </React.Fragment>

        ))}
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
