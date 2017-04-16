import React from 'react'
import Param from '../../containers/Param'
import Shot from '../../containers/Shot'
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

const Sketch = ({ title, params, shots, onDeleteClick, sketchId }) => (
  <Wrapper>
    <h2>{title}</h2>

    <Items>
      {params.map((id) => (
        <li key={id}>
          <Param paramId={id} />
        </li>
      ))}
    </Items>

    <Items>
      {shots.map((id) => (
        <li key={id}>
          <Shot shotId={id} />
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
  sketchId: React.PropTypes.string.isRequired,
  params: React.PropTypes.arrayOf(
    React.PropTypes.string
  ).isRequired,
  shots: React.PropTypes.arrayOf(
    React.PropTypes.string
  ).isRequired,
  onDeleteClick: React.PropTypes.func.isRequired

}

export default Sketch
