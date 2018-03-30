import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Link as LinkComponent } from 'react-router-dom'

const BaseLink = css`
flex: 0 0 20%;
color: white;
padding: 0 0.5rem 0.5rem 0;
text-decoration: none;
text-transform: uppercase;
cursor: pointer;


 > div {
   display: flex;
   align-items: center;
   justify-content: center;
   text-align: center;
   height: 4rem;
   background: black;
   border: 1px solid black;

   ${props => props.isActive && `
     border-color: white;
   `}
 }
`

const Link = styled(({ isActive, ...rest }) =>
  <LinkComponent {...rest} />)` ${BaseLink} `
const Button = styled.a` ${BaseLink} `

const SceneThumb = (props) => {
  if (props.to) {
    return <Link {...props}><div>{props.children}</div></Link>
  } else {
    return <Button {...props}><div>{props.children}</div></Button>
  }
}

SceneThumb.propTypes = {
  to: PropTypes.string,
  children: PropTypes.string.isRequired
}

export default SceneThumb
