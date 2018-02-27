import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import OverlayModal from '../OverlayModal'
import Button from '../Button'

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.8rem !important;
`

const Wrapper = styled.div`
  margin-bottom: 2rem;
`

const ErrorOverlay = ({ isVisible, onCancelClick, type, message, onChooseSketchFolderClick }) => {
  let inner = <p>Whoops!</p>

  switch (type) {
    case 'badSketchFolder':
      inner = (
        <Wrapper>
          <p>The sketch folder for this project could not be located. Please find the folder
      on your computer.</p>
          <Button size='large' onClick={onChooseSketchFolderClick}>Locate Sketch Folder</Button>
        </Wrapper>)
      break
  }

  return (
    <OverlayModal
      isVisible={isVisible}
      title={'Something went wrong'}
      onCancelClick={onCancelClick}
    >
      <ErrorMessage>Error: {message}</ErrorMessage>
      {inner}

    </OverlayModal>
  )
}

ErrorOverlay.propTypes = {
  isVisible: PropTypes.bool,
  onCancelClick: PropTypes.func,
  type: PropTypes.string,
  message: PropTypes.string,
  onChooseSketchFolderClick: PropTypes.func.isRequired
}

export default ErrorOverlay
