import React from 'react'
import PropTypes from 'prop-types'
import InputLinkTags from '../InputLinkTags'

const NodeInputInfo = ({
  inputLinkIds, isLearningMidi,
}) => (
  <div>
    {isLearningMidi
      ? 'Learning MIDI...'
      : <InputLinkTags ids={inputLinkIds} />
    }
  </div>
)

NodeInputInfo.propTypes = {
  inputLinkIds: PropTypes.arrayOf(
    PropTypes.string
  ),
  isLearningMidi: PropTypes.bool,
}

export default NodeInputInfo
