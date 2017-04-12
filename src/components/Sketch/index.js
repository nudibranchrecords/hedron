import React from 'react'
import Param from '../../containers/Param'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 0.5rem;
  display: flex;
  height: 100%;
  flex-direction: column;
`

const Items = styled.ul`
  display: flex;
`

const Bottom = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
`

const Sketch = ({ title, params, onDeleteClick }) => (
  <Wrapper>
    <h2>{title}</h2>

    <Items>
      {params.map((id) => (
        <li key={id}>
          <Param paramId={id} />
        </li>
      ))}
    </Items>

    <Bottom>
      <button onClick={onDeleteClick}>Delete Sketch</button>
    </Bottom>
  </Wrapper>
)

Sketch.propTypes = {
  title: React.PropTypes.string.isRequired,
  params: React.PropTypes.arrayOf(
    React.PropTypes.string
  ).isRequired,
  onDeleteClick: React.PropTypes.func.isRequired
}

export default Sketch
