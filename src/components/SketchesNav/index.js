import React from 'react'
import PropTypes from 'prop-types'
import NavItem from '../NavItem'
import styled from 'styled-components'

const Wrapper = styled.nav`
  margin-bottom: 2rem;
`

const SketchesNav = ({ items, sceneId, onNavItemClick, currentSketchId }) => (
  <Wrapper>
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <NavItem
            isActive={item.id === currentSketchId}
            onClick={() => { onNavItemClick(sceneId, item.id) }}
          >
            {item.title}
          </NavItem>
        </li>
      ))}
      <li><NavItem className='last' to={`/scenes/addSketch/${sceneId}`}>+</NavItem></li>
    </ul>
  </Wrapper>
)

SketchesNav.propTypes = {
  currentSketchId: PropTypes.oneOfType([
    PropTypes.string, PropTypes.bool
  ]).isRequired,
  sceneId: PropTypes.string.isRequired,
  onNavItemClick: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string
    })
  )
}

export default SketchesNav
