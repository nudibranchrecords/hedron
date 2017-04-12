import React from 'react'
import ParamBar from '../../containers/ParamBar'
import styled from 'styled-components'

const Wrapper = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  padding: 1rem;
`

const Sketch = ({ title, paramId }) => (
  <Wrapper>
    {title}
    <br />
    <ParamBar paramId={paramId} />
  </Wrapper>
)

Sketch.propTypes = {
  title: React.PropTypes.string.isRequired,
  paramId: React.PropTypes.string.isRequired
}

export default Sketch
