import React from 'react';
import * as SketchActions from '../../actions/SketchActions';

export default class InputSelectLfo extends React.Component {

	constructor(props) {
		super(props);

		this.handleMultiplyChange = this.handleMultiplyChange.bind(this);
		this.handleWaveShapeChange = this.handleWaveShapeChange.bind(this);

		this.inputParams = this.props.inputParams;
	}

	handleMultiplyChange(e) {

		this.inputParams.multiply = e.target.value;

		const id = this.props.sketchId;
		const param = this.props.paramKey;

		SketchActions.updateSketchParamInput({id, param, inputParams: this.inputParams});

	}

	handleWaveShapeChange(e) {

		this.inputParams.waveShape = e.target.value;

		const id = this.props.sketchId;
		const param = this.props.paramKey;

		SketchActions.updateSketchParamInput({id, param, inputParams: this.inputParams});

	}

	render() {

		console.log(this.props)

		return (
		  
		  <div>
		  	  <select value={this.props.inputParams.waveShape} onChange={this.handleWaveShapeChange}>
	          	<option value="sine">Sine</option>
	          	<option value="square">Square</option>
	          	<option value="sawTooth">Saw Tooth</option>
	          	<option value="rSawTooth">Reverse Saw Tooth</option>
	          	<option value="triangle">Triangle</option>
	          </select>
	          <select value={this.props.inputParams.multiply} onChange={this.handleMultiplyChange}>
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