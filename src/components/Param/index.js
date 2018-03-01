import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'
import Node from '../Node'
import styled, { ThemeProvider } from 'styled-components'
import inputIcon from '../../assets/icons/input.icon.txt'
import macroIcon from '../../assets/icons/macro.icon.txt'
import IconComponent from '../Icon'
import theme from '../../utils/theme'
import uiEventEmitter from '../../utils/uiEventEmitter'

const Wrapper = styled.div`
  width: 100%;
`

const Inner = styled(Node)`
  width: 100%;
  color: ${theme.textColorLight1};
  fill: ${theme.textColorLight1};

  ${props => props.isOpen && `
    border-bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-color: white;
  `};

  ${props => props.isActive && `
    border-color: ${theme.actionColor1};
  `}
`

const BarCol = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.25rem;
`

const Top = styled.div`
  padding: 0.5rem;
`

const Row = styled.div`
  display: flex;
  flex-direction: column;
`

const Bottom = styled.div`
  align-items: center;
  padding: 0.5rem 0.25rem 0.5rem 0.5rem;
  border: 1px solid white;
  position: absolute;
  left: 0.25rem;
  right: 0.25rem;
  margin-top: 0.5rem;

  ${props => props.isActive && `
    border-color: ${theme.actionColor1};
  `}
`

const Padder = styled.div`
  height: calc(${props => props.height}px + 0.5rem);

  &:after {
    display: block;
    position: relative;
    z-index: 2;
    content: "";
    border: 1px solid white;
    border-top-style: dashed;
    border-bottom: 0;
    height: calc(0.5rem + 2px);
    background: ${theme.bgColorDark1};

    ${props => props.isActive && `
      border-color: ${theme.actionColor1};
    `}
  }
`

const Title = styled.div`
  color: ${theme.textColorLight1};
  text-transform: uppercase;
  height: 1rem;
  font-size: 0.6rem;
  z-index: 1;
  position: absolute;
  top: 0.1rem;
  left: 0.2rem;
  width: 1000px;
  pointer-events: none;
`

const Icon = styled(IconComponent)`
  width: 0.6rem;
  height: 0.6rem;
  margin-right: 0.1rem;
`
const Info = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.6rem;
  cursor: pointer;
  text-transform: uppercase;

  > span {
    display: flex;
  }

  &:hover {
    color: ${theme.actionColor1};
    fill: ${theme.actionColor1};
  }
`

const IconInfo = styled.div`
  display: flex;
  margin-left: auto;

  > span {
    display: flex;
    margin-left: 0.3rem;
  }
`

class Param extends React.Component {
  constructor () {
    super()
    this.state = {
      bottomHeight: 0
    }
    this.calculateHeights = this.calculateHeights.bind(this)

    uiEventEmitter.on('repaint', this.calculateHeights)
  }

  componentDidMount () {
    this.calculateHeights()
  }

  componentWillUnmount () {
    uiEventEmitter.removeListener('repaint', this.calculateHeights)
  }

  componentDidUpdate (prevProps, prevState) {
    if (
        (prevProps.isOpen === false && this.props.isOpen === true) ||
        (prevProps.numInputs !== this.props.numInputs) ||
        (prevProps.numMacros !== this.props.numMacros)
    ) {
      this.calculateHeights()
    }
  }

  calculateHeights () {
    if (this.bottomEl) {
      this.setState({
        bottomHeight: this.bottomEl.offsetHeight
      })
    }
  }

  render () {
    const { title, nodeId, isOpen, onOpenClick, onParamBarClick,
    children, numInputs, numMacros, inputLinkTitle, isActive, type } = this.props

    return (
      <ThemeProvider theme={{ type }}>
        <Wrapper>
          <Inner isOpen={isOpen} isActive={isActive}>
            <Top>
              <Row>
                <BarCol>
                  <Title>{title}</Title>
                  <ParamBar nodeId={nodeId} onMouseDown={onParamBarClick} />
                </BarCol>
                <Info onClick={onOpenClick}>
                  {inputLinkTitle && <span><Icon glyph={inputIcon} />{inputLinkTitle}</span>}
                  <IconInfo>
                    {numInputs !== undefined && (<span><Icon glyph={inputIcon} />{numInputs}</span>)}
                    {numMacros !== undefined && (<span><Icon glyph={macroIcon} />{numMacros}</span>)}
                  </IconInfo>
                </Info>
              </Row>
            </Top>
          </Inner>
          {isOpen &&
          <div>
            <Bottom isActive={isActive} innerRef={node => { this.bottomEl = node }}>
              {children}
            </Bottom>
            <Padder isActive={isActive} height={this.state.bottomHeight} />
          </div>
          }
        </Wrapper>
      </ThemeProvider>
    )
  }

}

Param.propTypes = {
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  isActive: PropTypes.bool,
  onOpenClick: PropTypes.func.isRequired,
  onParamBarClick: PropTypes.func,
  children: PropTypes.node,
  numInputs: PropTypes.number,
  numMacros: PropTypes.number,
  inputLinkTitle: PropTypes.string,
  type: PropTypes.string
}

export default Param
