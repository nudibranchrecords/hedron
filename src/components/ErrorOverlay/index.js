import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import OverlayModal from '../OverlayModal'
import Button from '../Button'
import Col from '../Col'
import Row from '../Row'
import Control from '../../containers/Control'

const ErrorMessage = styled.p`
  opacity: 0.5;
  font-size: 0.8rem !important;
  margin: 0;
  user-select: text;
`

const Wrapper = styled.div`
  margin-bottom: 1rem;
  user-select: text;
`

const PopupControl = styled(Row)`
  margin-top: 1rem;
  font-size: 0.7rem;
  background: rgba(100,100,100,0.5);
  border-radius: 2px;
  padding: 0.5rem;
  text-align: left;
`

const ErrorOverlay = ({ isVisible, onCancelClick, code, message, onChooseSketchFolderClick }) => {
  let inner = <p>Whoops!</p>
  let showPopupControl = true

  switch (code) {
    case 'NO_SKETCH_FOLDER':
      showPopupControl = false
      inner = (
        <Wrapper>
          <p>The sketches folder for this project could not be located, please find the folder on your computer.
            Please note this is the <strong>parent folder of your sketches</strong>, usually named "sketches".
          </p>
          <Button size='large' onClick={onChooseSketchFolderClick}>Locate Sketches Folder</Button>
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

      {
        showPopupControl && <PopupControl>
          <Col width='2rem'><Control nodeId='areErrorPopupsDisabled' /></Col>
          <Col noWidth>Stop errors from popping up (Can be enabled again in settings)</Col>
        </PopupControl>
      }

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
