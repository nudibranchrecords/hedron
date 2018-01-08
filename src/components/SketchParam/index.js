import React from 'react'
import PropTypes from 'prop-types'
import Param from '../../containers/Param'
import InputLink from '../../containers/InputLink'
import ParamInputSelect from '../../containers/ParamInputSelect'
import InputLinkTabItem from '../../containers/InputLinkTabItem'
import styled from 'styled-components'

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

const SketchParam = (props) => (
  <Param {...props}>
    <Top>
      <Tabs>
        {props.inputLinkIds.map((id, index) => (
          <TabItem key={id}>
            <InputLinkTabItem id={id} index={index} nodeId={props.nodeId} />
          </TabItem>
        ))}
      </Tabs>
      <AddNew>
        <span>Add New Input:</span>
        <div><ParamInputSelect nodeId={props.nodeId} /></div>
      </AddNew>
    </Top>

    {props.currentInputLinkId && <InputLink id={props.currentInputLinkId} />}
  </Param>
)

SketchParam.propTypes = {
  inputLinkIds: PropTypes.arrayOf(
    PropTypes.string
  ),
  nodeId: PropTypes.string.isRequired,
  currentInputLinkId: PropTypes.string
}

export default SketchParam
