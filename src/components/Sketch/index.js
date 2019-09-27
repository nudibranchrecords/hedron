import React from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'
import SceneHeader from '../../containers/SceneHeader'
import styled from 'styled-components'
import ParamList from '../../containers/ParamList'
import ShotList from '../../containers/ShotList'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`

const Bottom = styled.div`
  margin-top: auto;
  padding-top: 3rem;
  padding-bottom: 0.5rem;
  flex: 0 0 2rem;

  & > div {
    display: flex;
    text-align: right;
    justify-content: space-between;
  }
`

const ActionButton = styled(Button)`
  margin-left: 0.5rem;
`

const DeleteButton = styled(Button)`
  margin-right: auto;
`

const Sketch = ({
  title, onDeleteClick, sketchId, onRenameClick, onReloadFileClick,
}) => (
  <Wrapper>
    <SceneHeader
      onButtonClick={e => {
        e.stopPropagation()
        onRenameClick(sketchId)
      }}
      buttonText='Rename'>
      {title}
    </SceneHeader>

    <ParamList sketchId={sketchId} />
    <ShotList sketchId={sketchId} />

    <Bottom>
      <div>
        <DeleteButton color='danger' onClick={() => { onDeleteClick(sketchId) }}>Delete Sketch</DeleteButton>
        <ActionButton onClick={() => { onReloadFileClick(sketchId) }}>Reload File</ActionButton>
      </div>
    </Bottom>
  </Wrapper>
)

Sketch.propTypes = {
  title: PropTypes.string.isRequired,
  sketchId: PropTypes.string.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onRenameClick: PropTypes.func.isRequired,
  onReloadFileClick: PropTypes.func.isRequired,
}

export default Sketch
