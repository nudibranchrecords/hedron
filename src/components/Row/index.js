import styled from 'styled-components'

const Row = styled.div`
  display: flex;
  align-items: ${props => props.align || 'flex-start'};
`

export default Row
