import React from 'react';
import ParamInputSelect from './ParamInputSelect';
import ParamBar from './ParamBar/ParamBar';
import Modifiers from './Modifiers';

export default class Param extends React.Component {

	render() {

		const paramKey = this.props.paramKey;
		const name = this.props.param.name;
		const input = this.props.param.input;
		const modifiers = this.props.param.modifiers;
		const showing = this.props.param.modifiersShowing;
		const value = this.props.param.value;
		const type = this.props.param.type;

		let modifyComponent;

		if (modifiers && input && input.type == 'audio') {
			modifyComponent = 
          		<Modifiers showing={showing} modifiers={modifiers} paramKey={paramKey} sketchId={this.props.sketchId} />;
		} else {
			modifyComponent = '';
		}
			

		return (

          	<div data-Param>
          		
          		<ParamBar 
          			type={type} 
          			value={value} 
          			paramName={name} 
          			paramKey={paramKey} 
          			sketchId={this.props.sketchId}  
          		/>          		
          		<ParamInputSelect 
          			paramKey={paramKey} 
          			input={input} 
          			sketchId={this.props.sketchId} 
          		/>
         		{modifyComponent}

          	</div>

		)

	}

}