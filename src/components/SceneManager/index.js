import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { NavLink } from 'react-router-dom'

const BaseLink = css`
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
`
const ThumbLink = styled(NavLink)` ${BaseLink} `
const ThumbButton = styled.a` ${BaseLink} `

const SketchesNav = ({ items, onAddClick }) => (
  <Wrapper>
    <Thumbs>
      {items.map(item => (
        <ThumbLink
          key={item.id}
          to={`/scenes/view/${item.id}`}
        >
          <div>{item.title}</div>
        </ThumbLink>
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