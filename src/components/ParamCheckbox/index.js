import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../utils/theme'

const Button = styled.div`
    height: 17px;
    border: 2px solid black;
    border-radius: 5px;
    background: ${props => props.theme === 'panel' ? theme.bgColorDark3 : theme.bgColorDark2};
    cursor: pointer;

    &.on {
        background: ${theme.actionColor1}
    }
`

const ParamCheckbox = ({ value, onClick }) => (
  <Button onClick={() => onClick(!value)} className={value === true && 'on'} />
)

ParamCheckbox.propTypes = {
  value: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default ParamCheckbox
