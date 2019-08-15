import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import MenuPanel from '../../components/MenuPanel'
import { PanelContext } from '../../context'
import theme from '../../utils/theme'

const List = styled.nav`
  display: flex;
`

const Item = styled.div`
  margin-right: 0.5rem;


  span:last-child {
    margin-left: 0.5rem;
  }

  &:last-child {
    span:last-child {
      display: none;
    }
  }

  ${props => props.isClickable &&
    `cursor: pointer;
    &:hover {
      span:first-child {
        color: ${theme.actionColor1}
      }
    }`
}
  
`

const PropertiesPanel = ({ isOpen, nodeId, Component, onCloseClick, panelId, titleItems, onTitleItemClick }) => {
  const titleContent = <List>
    {titleItems.map((item, index) => {
      const isClickable = item.type !== 'inputLink' && index !== titleItems.length - 1
      const onClick = isClickable ? function () { onTitleItemClick(item.id) } : undefined

      return (
        <Item
          key={item.id}
          isClickable={isClickable}
          onClick={onClick}
        >
          <span>{item.title}</span> <span>{'›'}</span>
        </Item>
      )
    })}
  </List>

  return (
    <PanelContext.Provider value={panelId}>
      {isOpen &&
      <MenuPanel titleContent={titleContent} onCloseClick={onCloseClick} key={nodeId}>
        <Component nodeId={nodeId} />
      </MenuPanel>
      }
    </PanelContext.Provider>
  )
}

PropertiesPanel.propTypes = {
  nodeId: PropTypes.string,
  isOpen: PropTypes.bool,
  Component: PropTypes.object,
  onCloseClick: PropTypes.func,
  panelId: PropTypes.string,
  titleItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    })
  ).isRequired,
  onTitleItemClick: PropTypes.func.isRequired,
}

export default PropertiesPanel
