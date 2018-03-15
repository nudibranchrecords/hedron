import styled from 'styled-components'

const Col = styled.div`
  ${props => props.width
    ? `flex: 0 0 ${props.width};`
    : `flex: 1;`
  }

  padding-right: 1rem;

  &:last-child {
    padding-right: 0;
  }
`

export default Col
