import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Wrapper = styled.nav`
  margin-bottom: 2rem;
`

const Thumbs = styled.div`
  display: flex;
`
const Thumb = styled(Link)`
  flex: 0 0 20%;
  color: white;
  padding: 0.5rem;
  text-decoration: none;
  text-transform: uppercase;

   > div {
     display: flex;
     align-items: center;
     justify-content: center;
     text-align: center;
     height: 4rem;
    background: black;
   }
`

const SketchesNav = ({ items }) => (
  <Wrapper>
    <Thumbs>
      {items.map(item => (
        <Thumb key={item.id} to={`/scenes/view/${item.id}`}><div>{item.title}</div></Thumb>
      ))}
    </Thumbs>
  </Wrapper>
)

SketchesNav.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string
    })
  )
}

export default SketchesNav
