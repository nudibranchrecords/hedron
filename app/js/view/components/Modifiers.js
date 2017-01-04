import React from 'react';

import Modifier from './Modifier';

export default class Modifiers extends React.Component {

	render() {

		const modifiers = this.props.modifiers;
		const paramKey = this.props.paramKey;

		let modifierEl = (

			<ul>
          		{Object.keys(modifiers).map((key, i) => {
	              return (
		              <li key={key}>
		              
		               	<Modifier
		              		paramKey={paramKey}
		              		sketchId={this.props.sketchId}
		              		modifier={modifiers[key]}
		              		index={i}
		              	/>

		              </li>
	              )
	            })}
          	</ul>

		)
		

		return (
			<div>
				<h5>Modifiers:</h5>
	          	{modifierEl}
          	</div>
		)

	}

}