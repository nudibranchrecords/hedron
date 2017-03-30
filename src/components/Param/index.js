import React from 'react'
import ParamBar from '../../containers/ParamBar'
import styled from 'styled-components'

const Wrapper = styled.div`
  background: #eee;
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
