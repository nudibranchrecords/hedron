import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Param from '../../containers/Param'
import InputLinkUI from '../../containers/InputLinkUI'
import theme from '../../utils/theme'

const Wrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
`

const ChannelButton = styled.div`
  text-align: center;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  width: 7rem;
  height: 53px;
  cursor: pointer;
`

const ChannelTag = styled.div`
  padding: 0.25rem;
  background: ${props => theme[`channel${props.children}Color`]};
  font-weight: bold;
`

const ChannelTitle = styled.div`
  background: black;
  padding: 0.25rem;
  font-size: 0.5rem;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Middle = styled.div`
  flex: 1;
  padding: 0 0.5rem;
`

const Crossfader = ({ titleA, titleB, onClickA, onClickB }) => (
  <Wrapper>
    <ChannelButton onClick={onClickA}>
      <ChannelTag>A</ChannelTag>
      <ChannelTitle>{titleA}</ChannelTitle>
    </ChannelButton>
    <Middle>
      <Param
        nodeId='sceneCrossfader'
        notInSketch
        >
        <InputLinkUI nodeId='sceneCrossfader' />
      </Param>
    </Middle>
    <ChannelButton onClick={onClickB}>
      <ChannelTag>B</ChannelTag>
      <ChannelTitle>{titleB}</ChannelTitle>
    </ChannelButton>
  </Wrapper>
)

Crossfader.propTypes = {
  titleA: PropTypes.string,
  titleB: PropTypes.string,
  onClickA: PropTypes.func.isRequired,
  onClickB: PropTypes.func.isRequired,
}

export default Crossfader
