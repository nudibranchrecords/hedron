import React from 'react';
import * as SketchActions from '../../actions/SketchActions';

export default class InputSelectMidi extends React.Component {

	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {

		const id = e.target.value;
		
		SketchActions.updateSketchParamInput(this.props.sketchId, this.props.paramKey, 'midi', id);

	}

	render() {

		const paramKey = this.props.paramKey;

		return (
		  
		  <div>
	          <select value={this.props.id} onChange={this.handleChange}>
	          	<option>1760</option>
	          	<option>1761</option>
	          	<option>1762</option>
	          	<option>1763</option>
	          </select>
          </div>

		)
	}

}