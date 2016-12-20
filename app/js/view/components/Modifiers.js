import React from 'react';
import * as SketchActions from '../../actions/SketchActions';

import ModifierInputSelect from './ModifierInputSelect';

export default class Modifiers extends React.Component {

	handleChange(i, e) {
		SketchActions.editSketchParamModifier(this.props.sketchId, this.props.paramKey, i, e.target.value);
	}
	
	render() {

		const modifiers = this.props.modifiers;


		const paramKey = this.props.paramKey;

		return (
			<div>
				<h5>Modifiers:</h5>
	          	<ul>
	          		{Object.keys(modifiers).map((key, i) => {
		              return (
			              <li key={key}>
			              	{modifiers[key].id}: {modifiers[key].m} <br/>
			              	<input type="range" value={modifiers[key].m} min="0" max="1" step="0.01" onChange={this.handleChange.bind(this, i)} />
			              	<ModifierInputSelect paramKey={paramKey} input={modifiers[key].input} modifierId={modifiers[key].id} sketchId={this.props.sketchId}  />
			              </li>
		              )
		            })}
	          	</ul>
          	</div>
		)

	}

}