import React from 'react';
import Param from './Param';

export default class Sketch extends React.Component {

	render() {

		const { title, id, params } = this.props.sketch;

		return (
			<div>
				<h2>{title} - { id }</h2>

				<ul>
		            {Object.keys(params).map((key) => {

		              return (

		              	<Param key={key} paramKey={key} value={params[key]} sketchId={id} />

		              )
		            })}
		        </ul>

			</div>
		)
	}

}