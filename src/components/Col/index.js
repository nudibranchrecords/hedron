import styled from 'styled-components'

const Col = styled.div`
  ${props => props.perc
    ? `flex: 0 0 ${props.perc}%;`
    : `flex: 1;`
  }

  padding-right: 1rem;

  &:last-child {
    padding-right: 0;
  }
`

export default Col
