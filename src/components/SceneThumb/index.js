import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import theme from '../../utils/theme'
import { Link as LinkComponent } from 'react-router-dom'
import Icon from '../Icon'
import postIcon from '../../assets/icons/postprocessing.icon.txt'

const BaseLink = css`
  display: block;
  color: white;
  padding: 0 0.25rem 0.5rem;
  text-decoration: none;
  text-transform: uppercase;
  cursor: pointer;
  position: relative;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 3rem;
    background: black;
    border: 1px solid black;
    font-size: 0.6rem;

    ${props => props.isActive && `
      border-color: white;
    `}

    .is-sorting & {
      border: 1px dashed white;
    }
  }
`

const ChannelLabel = styled.span`
  display: block;
  position: absolute;
  font-weight: bold;
  font-size: 0.6rem;
  bottom: calc(0.5rem + 1px);
  right: calc(0.5rem + 1px);
  padding: 0.25rem;
  background: ${props => theme[`channel${props.children}Color`]};
`

const PostLabel = styled.span`
  position: absolute;
  bottom: 0.75rem;
  left: 0.5rem;
  fill: white;
  border: 1px solid white;
  border-radius: 999px;
  background: black;
  height: 0.9rem;
  width: 0.9rem;

  > div {
    height: 100%;
    width: 100%;
  }
`

const Link = styled(({ isActive, ...rest }) =>
  <LinkComponent {...rest} />)` ${BaseLink} `
const Button = styled.a` ${BaseLink} `

const SceneThumb = ({ children, channel, hasPost, ...props }) => {
  const Wrapper = props.to ? Link : Button

  return (
    <Wrapper {...props}>
      <div>{children}</div>
      {channel && <ChannelLabel>{channel}</ChannelLabel>}
      {hasPost && <PostLabel><Icon glyph={postIcon} /></PostLabel>}
    </Wrapper>
  )
}

SceneThumb.propTypes = {
  to: PropTypes.string,
  children: PropTypes.string.isRequired,
  channel: PropTypes.string,
  hasPost: PropTypes.bool,
}

export default SceneThumb
