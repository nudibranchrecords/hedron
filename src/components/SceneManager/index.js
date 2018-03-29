import React from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'
import Row from '../Row'
import Col from '../Col'
import styled, { css } from 'styled-components'
import { NavLink } from 'react-router-dom'

const BaseLink = css`
flex: 0 0 20%;
color: white;
padding: 0 0.5rem 0.5rem 0;
text-decoration: none;
text-transform: uppercase;
cursor: pointer;


 > div {
   display: flex;
   align-items: center;
   justify-content: center;
   text-align: center;
   height: 4rem;
   background: black;
   border: 1px solid black;
 }

 &.active > div {
   border-color: white;
 }
`

const Wrapper = styled.nav`
  margin-bottom: 2rem;
`

const Thumbs = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`
const ThumbLink = styled(NavLink)` ${BaseLink} `
const ThumbButton = styled.a` ${BaseLink} `

const SceneManager = ({ items, onAddClick, currentScene, onDeleteClick, onRenameClick }) => (
  <Wrapper>
    <Thumbs>
      {items.map(item => (
        <ThumbLink
          key={item.id}
          to={`/scenes/view/${item.id}`}
          isActive={() => currentScene && currentScene.id === item.id}
        >
          <div>{item.title}</div>
        </ThumbLink>
      ))}
      <ThumbButton onClick={onAddClick}><div>+</div></ThumbButton>
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
