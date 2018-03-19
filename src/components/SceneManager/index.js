import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const css = `
flex: 0 0 20%;
color: white;
padding: 0.5rem;
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
 }
`

const Wrapper = styled.nav`
  margin-bottom: 2rem;
`

const Thumbs = styled.div`
  display: flex;
`
const ThumbLink = styled(Link)` ${css} `
const ThumbButton = styled.a` ${css} `

const SketchesNav = ({ items, onAddClick }) => (
  <Wrapper>
    <Thumbs>
      {items.map(item => (
        <ThumbLink key={item.id} to={`/scenes/view/${item.id}`}><div>{item.title}</div></ThumbLink>
      ))}
      <ThumbButton onClick={onAddClick}><div>+</div></ThumbButton>
    </Thumbs>
  </Wrapper>
)

SketchesNav.propTypes = {
  onAddClick: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string
    })
  )
}

export default SketchesNav
