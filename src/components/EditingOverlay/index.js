import React from 'react'
import PropTypes from 'prop-types'
import OverlayModal from '../OverlayModal'

const EditingOverlay = ({ isVisible, onCancelClick }) => (
  <OverlayModal
    isVisible={isVisible}
    title='Editing'
    onCancelClick={onCancelClick}
  >
    <p>Editing</p>
  </OverlayModal>
)

export default EditingOverlay

EditingOverlay.propTypes = {
  isVisible: PropTypes.bool,
  onCancelClick: PropTypes.func.isRequired
}
