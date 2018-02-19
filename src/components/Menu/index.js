// Having to use weird ref way of setting non standard attribute
// Better way may be possible in future
// https://github.com/facebook/react/issues/140

import React from 'react'
import PropTypes from 'prop-types'
import ButtonComponent from '../Button'
import styled from 'styled-components'
import Row from '../Row'

const Button = styled(ButtonComponent)`
  margin-right: 0.25rem;

  &:last-child {
    margin-right: 0;
  }
`

const Section = styled(Row)`
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 1rem;
`

const FilePath = styled.span`
  font-size: 0.5rem;
`

const Error = styled.div`
  background: red;
  color: white;
  padding: 0.2rem;
  font-size: 0.6rem;
  overflow: hidden;
`

const Menu = ({
  onSaveClick, onSaveAsClick, onLoadClick,
  filePath, saveIsDisabled, onSendOutputChange,
  displayOptions, onDevToolsClick, errorMessage
}) => {
  return (
    <div>
      <Section>
        <div>
          <h5>Project</h5>
          <Row align='center'>
            <Button onClick={onSaveClick} disabled={saveIsDisabled}>Save</Button>
            <Button onClick={onSaveAsClick}>Save As</Button>
            <Button onClick={onLoadClick}>Load</Button>
            <FilePath>{filePath}</FilePath>
          </Row>
        </div>
        <div>
          <h5>Displays</h5>
          <Row>
            {
              displayOptions.map((item, index) => (
                <Button key={index} onClick={() => onSendOutputChange(index)}>{item.label}</Button>
              ))
            }
          </Row>
        </div>
        <div>

          <Button to='/settings'>
            Settings
          </Button>
        </div>
      </Section>
      <Section>

        <div>
          <h5>Dev</h5>
          <Row align='center'>
            <Button onClick={onDevToolsClick}>
              Open DevTools
            </Button>
            {errorMessage && <Error>{errorMessage}</Error>}
          </Row>
        </div>

      </Section>

    </div>
  )
}

Menu.propTypes = {
  filePath: PropTypes.string,
  onSaveClick: PropTypes.func.isRequired,
  onSaveAsClick: PropTypes.func.isRequired,
  onLoadClick: PropTypes.func.isRequired,
  onSendOutputChange: PropTypes.func.isRequired,
  displayOptions: PropTypes.array.isRequired,
  saveIsDisabled: PropTypes.bool,
  onDevToolsClick: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
}

export default Menu
