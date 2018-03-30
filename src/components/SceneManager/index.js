import React from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'
import Row from '../Row'
import Col from '../Col'
import styled from 'styled-components'
import SceneThumb from '../SceneThumb'
import SceneThumbContainer from '../../containers/SceneThumb'

const Wrapper = styled.nav`
  margin-bottom: 2rem;
`

const Thumbs = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`

const SceneManager = (
  { items, onAddClick, currentScene, onDeleteClick, onRenameClick }
) => (
  <Wrapper>
    <Thumbs>
      {items.map(item => (
        <SceneThumbContainer
          key={item.id}
          id={item.id}
        />
      ))}
      <SceneThumb onClick={onAddClick}>+</SceneThumb>
    </Thumbs>
    {currentScene &&
      <div>
        <h3>{currentScene.title}</h3>
        <Row>
          <Col width='0'>
            <Button onClick={() => { onRenameClick(currentScene.id) }}>Rename</Button>
          </Col>
          <Col width='0'>
            <Button onClick={() => { onDeleteClick(currentScene.id) }}>Delete</Button>
          </Col>
        </Row>
      </div>
    }

  </Wrapper>
)

SceneManager.propTypes = {
  currentScene: PropTypes.object,
  onAddClick: PropTypes.func.isRequired,
  onRenameClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string
    })
  )
}

export default SceneManager
