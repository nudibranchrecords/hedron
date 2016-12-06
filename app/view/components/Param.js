import React from 'react';
import { editParam } from '../../actions/SketchActions';

export default class Param extends React.Component {

	edit(e) {
		editParam(this.props.sketchId, this.props.id, e.target.value);
	}
	
	render() {

		const id = this.props.id;
		const value = this.props.value;

		return (
			
          	<li key={id}>
          		<h3>{id} : {value}</h3>
          		<input id={id} type="range" value={value} min="0" max="1" step="0.001" onChange={this.edit.bind(this)} />
          	</li>

		)
	}

}