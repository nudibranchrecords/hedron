import React from 'react';
import { editSketchParam } from '../../actions/SketchActions';

export default class Param extends React.Component {

	edit(e) {
		editSketchParam(this.props.sketchId, this.props.paramKey, e.target.value);
	}
	
	render() {

		const paramKey = this.props.paramKey;
		const value = this.props.value;

		return (
			
          	<li key={paramKey}>
          		<h3>{paramKey} : {value}</h3>
          		<input id={paramKey} type="range" value={value} min="0" max="1" step="0.001" onChange={this.edit.bind(this)} />
          	</li>

		)
	}

}