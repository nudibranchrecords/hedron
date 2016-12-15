import React from 'react';
import * as SketchActions from '../../actions/SketchActions';
import InputSelect from './InputSelect';
import ParamBar from './ParamBar';

export default class Param extends React.Component {
	
	render() {

		const paramKey = this.props.paramKey;
		const value = this.props.param.value;
		const name = this.props.param.name;
		const input = this.props.param.input;

		return (
			
          	<li key={paramKey}>
          		<h3>{name} : {value}</h3>

          		<ParamBar value={value} />          		
          		<InputSelect paramKey={paramKey} input={input} sketchId={this.props.sketchId} />

          	</li>

		)

	}

}