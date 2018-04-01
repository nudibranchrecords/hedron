import React from 'react'
import PropTypes from 'prop-types'
import ButtonComponent from '../Button'
import RowComponent from '../Row'
import styled from 'styled-components'
import SceneThumb from '../SceneThumb'
import SceneThumbContainer from '../../containers/SceneThumb'
import InputLinkMidiControl from '../InputLinkMidiControl'
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

const Item = ({ title, onClick, color }) =>
  <Col>
    <Button onClick={onClick} color={color}>{title}</Button>
    <InputLinkMidiControl />
  </Col>

const SceneManager = (
  { items, onAddClick, currentScene, onDeleteClick, onRenameClick, onChannelClick }
) => (
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
          />
          <Item
            title='Add to B'
            onClick={() => { onChannelClick(currentScene.id, 'B') }}
            color='channelB'
          />
          <Item
            title='Add to Active'
            onClick={() => {}}
          />
          <Item
            title='Add to Opposite'
            onClick={() => {}}
          />
          <Item
            title='Clear'
            onClick={() => {}}
          />
          <Col>
            <Button onClick={() => { onRenameClick(currentScene.id) }}>Rename</Button>
          </Col>
          <Col>
            <Button color='danger' onClick={() => { onDeleteClick(currentScene.id) }}>Delete</Button>
          </Col>
        </Row>
      </Panel>
    }
  </Wrapper>
)

SceneManager.propTypes = {
  currentScene: PropTypes.object,
  onAddClick: PropTypes.func.isRequired,
  onRenameClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onChannelClick: PropTypes.func.isRequired,
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
  color: PropTypes.string
}

export default SceneManager
