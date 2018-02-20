import React from 'react'
import PropTypes from 'prop-types'
import OverlayModal from '../OverlayModal'
import EditingOverlayForm from '../../containers/EditingOverlayForm'

const EditingOverlay = ({ isVisible, onCancelClick, title, id }) => (
  <OverlayModal
    isVisible={isVisible}
    title={title}
    onCancelClick={onCancelClick}
  >
    <EditingOverlayForm id={id} />
  </OverlayModal>
)

EditingOverlay.propTypes = {
  isVisible: PropTypes.bool,
  onCancelClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ])
}

export default EditingOverlay
