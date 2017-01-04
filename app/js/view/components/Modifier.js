import React from 'react';

import ModifierInputSelect from './ModifierInputSelect';
import ModifierControl from './ModifierControl';

export default class Modifier extends React.Component {

	render() {

		return (
			 <div>
			              
         	<ModifierControl
        		paramKey={this.props.paramKey}
        		sketchId={this.props.sketchId}
        		modifierId={this.props.modifier.id}
        		m={this.props.modifier.m}
            index={this.props.index}
        	/>

        	<ModifierInputSelect 
        		paramKey={this.props.paramKey} 
        		input={this.props.modifier.input} 
        		modifierId={this.props.modifier.id} 
        		sketchId={this.props.sketchId}  
        	/>
         
      </div>
		)

	}

}