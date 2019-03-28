import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Manager, Reference, Popper } from 'react-popper'

const Option = styled.div`
  cursor: pointer;
`

const Dropdown = styled.div`
 background: black;
 padding: 0.5rem;
 visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
 pointer-events: ${props => props.isVisible ? 'default' : 'none'};
 z-index: 10;
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

    <Popper
      modifiers={{
        preventOverflow: {
          boundariesElement: 'window',
        },
      }}
    >
      {({ ref, style, placement }) => (
        <Dropdown ref={ref} style={style} data-placement={placement} isVisible={isOpen}>

          {options.map(option =>
            <Option key={option.value}
              onMouseDown={e => onChange(option)}>
              {option.label}
            </Option>
            )}

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
