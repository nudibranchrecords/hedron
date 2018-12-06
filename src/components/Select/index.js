import React from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'
import styled from 'styled-components'
import Row from '../Row'
import MidiButton from '../MidiButton'
import SubNode from '../SubNode'

const SelectCol = styled.div`
  flex: 1;
`

const Select = ({ nodeId, options, onChange, title, value, onAssignClick }) => (
  <SubNode nodeId={nodeId} title={title}>
    <Row>
      <SelectCol>
        <ReactSelect
          clearable={false}
          searchable={false}
          value={value}
          options={options}
          onChange={onChange}
        />
      </SelectCol>
      <MidiButton onClick={onAssignClick} />
    </Row>
  </SubNode>
)

Select.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
  options: PropTypes.arrayOf(
    PropTypes.object
  ),
  onChange: PropTypes.func.isRequired,
  onAssignClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
}

export default Select
