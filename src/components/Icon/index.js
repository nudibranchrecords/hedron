import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 1rem;
  height: 1rem;
`

const Icon = (props) => {
  const { glyph } = props
  return (
    <Wrapper
      dangerouslySetInnerHTML={{ __html: glyph }}
      {...props}
    />
  )
}
Icon.propTypes = {
  glyph: PropTypes.string.isRequired,
}

export default Icon
