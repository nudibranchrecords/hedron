import React from 'react';
import * as SketchActions from '../../actions/SketchActions';
import InputSelect from './InputSelect';

export default class Param extends React.Component {

	edit(e) {
		SketchActions.editSketchParam(this.props.sketchId, this.props.paramKey, parseFloat(e.target.value));
	}
	
	render() {

		const paramKey = this.props.paramKey;
		const value = this.props.param.value;
		const name = this.props.param.name;
		const inputId = this.props.param.inputId;

		return (
			
          	<li key={paramKey}>
          		<h3>{name} : {value}</h3>
          		<input id={paramKey} type="range" value={value} min="0" max="1" step="0.001" onChange={this.edit.bind(this)} />
          		<br/>
          		<InputSelect paramKey={paramKey} inputId={inputId} sketchId={this.props.sketchId} />
          	</li>

		)

		return <div></div>;

	}

}