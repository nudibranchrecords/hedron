import React from 'react';
import * as SketchActions from '../../actions/SketchActions';

export default class InputSelectLfo extends React.Component {

	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {

		const multiply = e.target.value;
		const id = this.props.sketchId;
		const param = this.props.paramKey;

		const inputParams = {
			type: 'lfo',
			waveShape: 'sine', 
			delta: 0, 
			multiply
		};

		SketchActions.updateSketchParamInput({id, param, inputParams});

	}

	render() {

		const paramKey = this.props.paramKey;

		return (
		  
		  <div>
	          <select value={this.props.id} onChange={this.handleChange}>
	          	<option value="4">4</option>
	          	<option value="2">2</option>
	          	<option value="1">1</option>
	          	<option value="0.5">2/1</option>
	          	<option value="0.25">4/1</option>
	          	<option value="0.125">8/1</option>
	          	<option value="0.0625">16/1</option>
	          </select>
          </div>

		)
	}

}