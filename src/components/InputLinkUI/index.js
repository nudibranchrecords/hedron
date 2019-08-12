import React from 'react'
import PropTypes from 'prop-types'
import InputLink from '../../containers/InputLink'
import ParamInputSelect from '../../containers/ParamInputSelect'
import InputLinkTabItem from '../../containers/InputLinkTabItem'
import styled from 'styled-components'

const Wrapper = styled.div`
`
const AddNew = styled.div`
  display: flex;
  font-size: 0.7rem;
  align-items: center;

  span {
    margin-left: auto;
    margin-right: 0.5rem;
  }
`

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  align-items: center;
`

const Tabs = styled.div`
  display: flex;
`

const TabItem = styled.a`
  display: block;
  margin-right: 0.25rem;
`

const InputLinkUI = ({ inputLinkIds, nodeId, currentInputLinkId }) => (
  <Wrapper>
    <Top>
      <Tabs>
        {inputLinkIds.alwaysActive.map((id, index) => (
          <TabItem key={id}>
            <InputLinkTabItem id={id} index={index} nodeId={nodeId} />
          </TabItem>
        ))}
      </Tabs>
      <Tabs>
        {inputLinkIds.toggledActive.map((id, index) => (
          <TabItem key={id}>
            <InputLinkTabItem id={id} index={index} nodeId={nodeId} />
          </TabItem>
        ))}
      </Tabs>
      <AddNew>
        <span>Add New Input:</span>
        <div><ParamInputSelect nodeId={nodeId} /></div>
      </AddNew>
    </Top>

    {currentInputLinkId && <InputLink id={currentInputLinkId} nodeId={nodeId} />}
  </Wrapper>
)

InputLinkUI.propTypes = {
  inputLinkIds: PropTypes.shape({
    alwaysActive: PropTypes.arrayOf(
      PropTypes.string
    ).isRequired,
    toggledActive: PropTypes.arrayOf(
      PropTypes.string
    ).isRequired,
  }).isRequired,
  nodeId: PropTypes.string.isRequired,
  currentInputLinkId: PropTypes.string,
}

export default InputLinkUI
