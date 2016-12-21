import React from 'react';
import Param from './Param';
import * as SketchActions from '../../actions/SketchActions';

export default class Sketch extends React.Component {

	deleteThis() {

		SketchActions.deleteSketch(this.props.sketch.id);

	}

	render() {

		const { id, title, params } = this.props.sketch;

		return (
			<div>
				<h2>{title} - { id }</h2>

				<ul data-Params>
		            {Object.keys(params).map((key) => {

		              return (
		              	<li data-Params-Item key={key}>
		              		<Param paramKey={key} param={params[key]} sketchId={id} />
		              	</li>
		              )
		            })}
		        </ul>

		        <button onClick={this.deleteThis.bind(this)}>Delete Sketch</button>

			</div>
		)
	}

}