import React from 'react'

const ParamBar = ({ value, onChange }) => {
  return (
    <div>
      {value}<br />
      <input type='range' value={value} min='0' max='1' step='0.001' onChange={onChange} />
    </div>
  )
}

// class ParamBar extends React.Component {

//   shouldComponentUpdate (nextProps, nextState) {
//     return true
//   }

//   render () {
//     return (
//       <div>
//         {this.props.value}<br />
//         <input type='range' value={this.props.value} min='0' max='1' step='0.001' onChange={this.props.onChange} />
//       </div>
//     )
//   }
// }

ParamBar.propTypes = {
  value: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired
}

export default ParamBar
