import React from 'react'
import PropTypes from 'prop-types'
import OverlayModal from '../OverlayModal'
import EditingOverlayForm from '../../containers/EditingOverlayForm'

const EditingOverlay = ({ isVisible, onCancelClick, title, id, type }) => (
  <OverlayModal
    isVisible={isVisible}
    title={title}
    onCancelClick={onCancelClick}
  >
    <EditingOverlayForm id={id} type={type} />
  </OverlayModal>
)

EditingOverlay.propTypes = {
  isVisible: PropTypes.bool,
  onCancelClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  type: PropTypes.string,
}

export default EditingOverlay
