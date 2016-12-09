import React from 'react';
import Param from './Param';
import * as SketchActions from '../../actions/SketchActions';

export default class Sketch extends React.Component {

	deleteThis() {

		SketchActions.deleteSketch(this.props.sketch.id);

	}

	render() {

		const { title, id, params } = this.props.sketch;

		return (
			<div>
				<h2>{title} - { id }</h2>

				<ul>
		            {Object.keys(params).map((key) => {

		              return (

		              	<Param key={key} paramKey={key} param={params[key]} sketchId={id} />

		              )
		            })}
		        </ul>

		        <a onClick={this.deleteThis.bind(this)}>Delete Sketch</a>

			</div>
		)
	}

}