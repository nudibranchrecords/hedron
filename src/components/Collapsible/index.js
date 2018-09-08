import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactCollapsible from 'react-collapsible'
import theme from '../../utils/theme'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.7rem;
  padding: 0px;
  padding-bottom: .2rem;
  .collapsibleOpen {
    border-style:solid;
    border-width: 1px;
    border-color: ${theme.lineColor2}
  }
  .Collapsible__contentInner {
    padding: 5px;
    background: ${theme.bgColorDark2};
  }
  .Collapsible__trigger{
    display: block;
    background: ${theme.bgColorDark1};
    transition-duration:.3s;
  }
  .Collapsible__trigger:hover{
    background: ${theme.actionColor1};
  }
`

class Collapsible extends React.Component {
  componentWillMount () {
    this.setState({ text: '► ' + this.props.title })
  }
  onOpen () {
    this.setState({ text: '▼ ' + this.props.title })
  }
  onClose () {
    this.setState({ text: '► ' + this.props.title })
  }
  render () {
    return <Wrapper>
      <ReactCollapsible {...
      {
        trigger:this.state.text,
        transitionTime:1,
        onOpen:() => { this.onOpen() },
        onClose:() => { this.onClose() },
        className:'collapsibleClosed',
        openedClassName:'collapsibleOpen'
      }}>
        {this.props.children}
      </ReactCollapsible>
    </Wrapper>
  }
}

Collapsible.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
}

export default Collapsible
