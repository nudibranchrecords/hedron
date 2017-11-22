import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from '../Button'

const Wrapper = styled.div`
  padding: 0.5rem;
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: auto;
`

const SketchesNav = ({ items }) => (
  <Wrapper>
    <h2>Macros</h2>
    <div>
      <Button size='large'>Add Macro</Button>
    </div>
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
