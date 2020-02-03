import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const FilePath = styled.span`
  font-size: 0.8rem;
  user-select: text;
`

const Error = styled.div`
  background: red;
  color: white;
  padding: 0.2rem;
  font-size: 0.6rem;
  overflow: hidden;
  margin-top: 0.5rem;
  user-select: text;
`

const Menu = ({
  filePath, errorMessage,
}) => {
  return (
    <div>
      {filePath && <FilePath><strong>Current Project:</strong> {filePath}</FilePath>}
      {errorMessage && <Error>{errorMessage}</Error>}
    </div>
  )
}

Menu.propTypes = {
  filePath: PropTypes.string,
  errorMessage: PropTypes.string,
}

export default Menu
