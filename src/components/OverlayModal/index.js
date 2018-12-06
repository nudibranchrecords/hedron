import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: fixed;
  background: rgba(0,0,0,0.5);
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  p {
    font-size: 1rem;
  }
`

const Inner = styled.div`
  background: rgba(0,0,0,0.8);
  border-radius: 10px;
  padding: 3rem;
  text-align: center;
  position: relative;
  cursor: default;
`

const Close = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  height: 1rem;
  width: 1rem;
  line-height: 1rem;
  text-align: center;
  font-weight: bold;
  font-size: 2rem;
  opacity: 0.5;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`
const OverlayModal = ({ isVisible, title, onCancelClick, children }) => (
  <div>
    {isVisible &&
      <Wrapper onMouseDown={e => { e.stopPropagation(); onCancelClick() }}>
        <Inner onMouseDown={e => e.stopPropagation()}>
          {title && <h2>{title}</h2>}
          {children}
          {onCancelClick && <Close onClick={onCancelClick}>&times;</Close>}
        </Inner>
      </Wrapper>
    }
  </div>
)

export default OverlayModal

OverlayModal.propTypes = {
  title: PropTypes.string,
  isVisible: PropTypes.bool,
  onCancelClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}
