import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import OverlayModal from '../OverlayModal'
import Button from '../Button'

const ErrorMessage = styled.p`
  opacity: 0.5;
  font-size: 0.8rem !important;
  margin: 0;
`

const Wrapper = styled.div`
  margin-bottom: 1rem;
`

const ErrorOverlay = ({ isVisible, onCancelClick, code, message, onChooseSketchFolderClick }) => {
  let inner = <p>Whoops!</p>

  switch (code) {
    case 'NO_SKETCH_FOLDER':
      inner = (
        <Wrapper>
          <p>The sketches folder for this project could not be located, please find the folder on your computer.</p>
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

      {inner}
      <ErrorMessage>{message}</ErrorMessage>

    </OverlayModal>
  )
}

ErrorOverlay.propTypes = {
  isVisible: PropTypes.bool,
  onCancelClick: PropTypes.func,
  code: PropTypes.string,
  message: PropTypes.string,
  onChooseSketchFolderClick: PropTypes.func.isRequired,
}

export default ErrorOverlay
