import React from 'react';
import Modifier from './Modifier';
import * as SketchActions from '../../actions/SketchActions';

export default class Modifiers extends React.Component {

	toggleModifiers() {
		SketchActions.toggleSketchParamModifiers(this.props.sketchId, this.props.paramKey);
	}

	render() {

		const modifiers = this.props.modifiers;
		const paramKey = this.props.paramKey;

		let modifierEl, toggleText;

		if (this.props.showing) {
			modifierEl = (

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

			toggleText = 'Hide';
		} else {
			toggleText = 'Show';
		}

		return (
			<div>
				<h5>Modifiers: <a onClick={this.toggleModifiers.bind(this)}>{toggleText}</a></h5>
	          	{modifierEl}
          	</div>
		)

	}

}