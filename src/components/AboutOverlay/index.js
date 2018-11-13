import React from 'react'
import PropTypes from 'prop-types'
import OverlayModal from '../OverlayModal'
import styled from 'styled-components'
import logo from '../../../build/icon.png'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    max-width: 15rem;
    margin-bottom: 1rem;
  }

  p:last-child {
    margin: 0;
  }
`

const Credits = styled.div`
  border-top: 1px solid rgba(255,255,255,0.5);
  width: 100%;
  padding-top: 1rem;

  p {
    font-size: 0.8rem;
  }
`

const AboutOverlay = ({ isVisible, onCancelClick }) => (
  <OverlayModal
    isVisible={isVisible}
    title={`v${process.env.npm_package_version}`}
    onCancelClick={onCancelClick}
  >
    <Wrapper>
      <img src={logo} />

      <p>Hedron is an open-source project brought to you
        by <a href='http://nudibranchrecords.uk'>Nudibranch</a></p>
      <p>Give feedback, report bugs or improve the software
        on <a href='https://github.com/nudibranchrecords/hedron'>Github</a></p>
      <Credits>
        <p>Logo created by <a href='http://netgrind.net/'>Cale Bradbury</a></p>
      </Credits>
    </Wrapper>
  </OverlayModal>
)

AboutOverlay.propTypes = {
  isVisible: PropTypes.bool,
  onCancelClick: PropTypes.func.isRequired,
}

export default AboutOverlay
