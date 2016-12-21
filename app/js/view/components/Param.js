import React from 'react';
import ParamInputSelect from './ParamInputSelect';
import ParamBar from './ParamBar/ParamBar';
import Modifiers from './Modifiers';

export default class Param extends React.Component {
	
	render() {

		const paramKey = this.props.paramKey;
		const value = this.props.param.value;
		const name = this.props.param.name;
		const input = this.props.param.input;
		const modifiers = this.props.param.modifiers;
		let modifyComponent;

		if (modifiers && input && input.type == 'audio') {
			modifyComponent = 
          		<Modifiers modifiers={modifiers} paramKey={paramKey} sketchId={this.props.sketchId} />;
		} else {
			modifyComponent = '';
		}
			

		return (

          	<div data-Param>
          		<h3 data-Param-Header>{name} : {value}</h3>

          		<ParamBar value={value} paramKey={paramKey} sketchId={this.props.sketchId}  />          		
          		<ParamInputSelect paramKey={paramKey} input={input} sketchId={this.props.sketchId} />
         		{modifyComponent}

          	</div>

		)

	}

}