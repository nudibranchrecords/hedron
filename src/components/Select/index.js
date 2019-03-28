import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../utils/theme'

import { Manager, Reference, Popper } from 'react-popper'

const Button = styled.div`
  height: 18px;
  border: 1px solid ${theme.lineColor2};
  padding: 0 0.25rem;
  font-size: 11px;
  overflow: hidden;
  background-color: ${theme.bgColorDark3};
  display: flex;
  align-items: center;
`

const Option = styled.div`
  cursor: pointer;
  padding: 0.25rem 0.5rem;

  &:hover {
    color: white;
    background-color: ${theme.bgColorDark2};
  }
`

const Dropdown = styled.div`
  background: black;
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  pointer-events: ${props => props.isVisible ? 'default' : 'none'};
  z-index: 10;
  border: 1px solid ${theme.lineColor2};
  margin: 0.25rem;
`

const Select = ({ onOpenClick, isOpen, options, onChange, buttonText }) => (
  <Manager>
    <Reference>
      {({ ref }) => (
        <Button ref={ref} onClick={onOpenClick} onMouseDown={e => e.stopPropagation()}>
          { buttonText }
        </Button>
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
