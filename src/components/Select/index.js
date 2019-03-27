import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Manager, Reference, Popper } from 'react-popper'

const Option = styled.div`
  cursor: pointer;
`

const Dropdown = styled.div`
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
`

const Select = ({ onOpenClick, isOpen, options, onChange, buttonText }) => (

  <Manager>
    <Reference>
      {({ ref }) => (
        <button type='button' ref={ref} onClick={onOpenClick} onMouseDown={e => e.stopPropagation()}>
          { buttonText }
        </button>
      )}
    </Reference>

    <Popper placement='bottom'>
      {({ ref, style, placement, arrowProps }) => (
        <Dropdown isVisible={isOpen}>
          <div ref={ref} style={style} data-placement={placement}>
            <div ref={arrowProps.ref} style={arrowProps.style} />
            {options.map(option =>
              <Option key={option.value}
                onMouseDown={e => onChange(option)}>
                {option.label}
              </Option>
            )}
          </div>
        </Dropdown>
        )}
    </Popper>
  </Manager>

)

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.object
  ),
  onChange: PropTypes.func.isRequired,
  onOpenClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  buttonText: PropTypes.string,
}

export default Select
