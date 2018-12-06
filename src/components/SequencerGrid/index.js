import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../utils/theme'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
  width: 100%;
`

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${100 / 8}%;
  height: 1rem;
  border: 1px solid ${theme.bgColorDark1};
  background: ${props => props.isActive ? theme.actionColor1 : theme.bgColorDark2};
  cursor: pointer;
  text-align: center;
  color: ${props => props.isActive ? 'white' : theme.textColorLight1};
  font-size: 0.5rem;

  &:hover {
    border: 1px solid white;
  }
`

class SequencerGrid extends React.Component {
  constructor () {
    super()
    this.state = {
      mouseDown: false,
    }
  }
  render () {
    return (
      <Wrapper onMouseLeave={() => this.setState({ mouseDown: false })}>
        {this.props.items.map((step, index) => (
          <Item
            key={index}
            isActive={step === 1}
            onClick={() => this.props.onStepClick(this.props.items, index)}
            onMouseEnter={() => {
              if (this.state.mouseDown) {
                this.props.onStepClick(this.props.items, index)
              }
            }}
            onMouseDown={() => this.setState({ mouseDown: true })}
            onMouseUp={() => this.setState({ mouseDown: false })}
            >
            {index % 8 + 1}
          </Item>
        ))}
      </Wrapper>
    )
  }
}

SequencerGrid.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.number
  ).isRequired,
  onStepClick: PropTypes.func.isRequired,
}

export default SequencerGrid
