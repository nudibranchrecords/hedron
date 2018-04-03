import React from 'react'
import PropTypes from 'prop-types'
import ButtonComponent from '../Button'
import RowComponent from '../Row'
import styled from 'styled-components'
import SceneThumb from '../SceneThumb'
import SceneThumbContainer from '../../containers/SceneThumb'
import InputLinkMidiControl from '../../containers/InputLinkMidiControl'
import theme from '../../utils/theme'

const Wrapper = styled.nav`
  margin-bottom: 2rem;
`

const Row = styled(RowComponent)`
  flex-wrap: wrap;
`

const Button = styled(ButtonComponent)`
`

const Thumbs = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`

const Panel = styled.div`
  padding: 0.5rem;
  padding-bottom: 0;
  background: ${theme.bgColorDark2};

  h4 {
    font-size: 0.7rem;
    text-transform: uppercase;
  }

  svg {
    fill: #fff;
    opacity: 0.8;
    margin-left: 0.2rem;

    &:hover {
      opacity: 1;
    }
  }
`

const Col = styled.div`
  margin-right: 1rem;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`

const Item = ({ title, onClick, linkableActionId, color }) =>
  <Col>
    <Button onClick={onClick} color={color}>{title}</Button>
    <InputLinkMidiControl linkableActionId={linkableActionId} />
  </Col>

const SceneManager = (
  {
    items, onAddClick, currentScene, onDeleteClick, onRenameClick, onChannelClick,
    onClearClick, onActiveClick, onOppositeClick
 }
) => {
  const la = currentScene && currentScene.linkableActionIds
  return (
    <Wrapper>
      <Thumbs>
        {items.map(item => (
          <SceneThumbContainer
            key={item.id}
            id={item.id}
        />
      ))}
        <SceneThumb onClick={onAddClick}>+</SceneThumb>
      </Thumbs>
      {currentScene &&
      <Panel>
        <h4>Current scene: {currentScene.title}</h4>

        <Row>
          <Item
            title='Add to A'
            onClick={() => { onChannelClick(currentScene.id, 'A') }}
            color='channelA'
            linkableActionId={la.addToA}
          />
          <Item
            title='Add to B'
            onClick={() => { onChannelClick(currentScene.id, 'B') }}
            color='channelB'
            linkableActionId={la.addToB}
          />
          <Item
            title='Add to Active'
            onClick={() => { onActiveClick(currentScene.id) }}
            linkableActionId={la.addToActive}
          />
          <Item
            title='Add to Opposite'
            onClick={() => { onOppositeClick(currentScene.id) }}
            linkableActionId={la.addToOpposite}
          />
          <Item
            title='Clear'
            onClick={() => { onClearClick(currentScene.id) }}
            linkableActionId={la.clear}
          />
          <Col>
            <Button
              onClick={e => {
                e.stopPropagation()
                onRenameClick(currentScene.id)
              }
              }>Rename</Button>
          </Col>
          <Col>
            <Button color='danger' onClick={() => { onDeleteClick(currentScene.id) }}>Delete</Button>
          </Col>
        </Row>
      </Panel>
    }
    </Wrapper>
  )
}

SceneManager.propTypes = {
  currentScene: PropTypes.object,
  onAddClick: PropTypes.func.isRequired,
  onRenameClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onChannelClick: PropTypes.func.isRequired,
  onClearClick: PropTypes.func.isRequired,
  onActiveClick: PropTypes.func.isRequired,
  onOppositeClick: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string
    })
  )
}

Item.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.string,
  linkableActionId: PropTypes.string.isRequired
}

export default SceneManager
