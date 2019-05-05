import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../utils/theme'
import downIcon from '../../assets/icons/down.icon.txt'
import uiEventEmitter from '../../utils/uiEventEmitter'

import { Manager, Reference, Popper } from 'react-popper'
import Icon from '../Icon'

const Button = styled.div`
  height: 18px;
  border: 1px solid ${theme.lineColor2};
  padding: 0 0.125rem 0 0.25rem;
  font-size: 11px;
  overflow: hidden;
  background-color: ${theme.bgColorDark3};
  display: flex;
  align-items: center;
  position: relative;
  border-color: ${props => props.isOpen ? 'white' : theme.lineColor2};
  cursor: pointer;
`

const DownIcon = styled(Icon)`
  width: 0.8rem;
  height: 0.8rem;
  fill: ${theme.lineColor2};
  position: absolute;
  right: 0;
  background: ${theme.bgColorDark3};
  z-index: 12;
`

const Option = styled.div`
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  font-size: 11px;
  color: ${props => props.isActive ? 'white' : 'inherit'};
  font-weight: ${props => props.isActive ? 'bold' : 'normal'};

  &:hover {
    color: white;
    background-color: ${theme.bgColorDark2};
  }
`

const Dropdown = styled.div`
  background: black;
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  pointer-events: ${props => props.isVisible ? 'default' : 'none'};
  z-index: 15;
  border: 1px solid ${theme.lineColor2};
  margin: 0.25rem;
  min-width: 5rem;
`

class Select extends React.Component {
  constructor (props) {
    super(props)
    this.repaint = this.repaint.bind(this)
  }

  componentDidMount () {
    uiEventEmitter.on('repaint', this.repaint)
  }

  componentWillUnmount () {
    uiEventEmitter.removeListener('repaint', this.repaint)
  }

  repaint () {
    if (this.scheduleUpdate) this.scheduleUpdate()
  }

  render () {
    const { onOpenClick, isOpen, options, onChange, buttonText, value } = this.props

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <Button ref={ref} onClick={onOpenClick} onMouseDown={e => e.stopPropagation()} isOpen={isOpen}>
              { buttonText }
              <DownIcon glyph={downIcon} />
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
          {({ ref, style, placement, outOfBoundaries, scheduleUpdate }) => {
            if (!this.scheduleUpdate) this.scheduleUpdate = scheduleUpdate

            return (
              <Dropdown ref={ref} style={style} data-placement={placement} isVisible={isOpen}>

                {options.map(option =>
                  <Option
                    key={option.value}
                    isActive={value === option.value}
                    onMouseDown={e => onChange(option)}
                  >
                    {option.label}
                  </Option>
                )}

              </Dropdown>
            )
          }}
        </Popper>
      </Manager>
    )
  }
}

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.object
  ),
  onChange: PropTypes.func.isRequired,
  onOpenClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  buttonText: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number, PropTypes.bool,
  ]),
}

export default Select
