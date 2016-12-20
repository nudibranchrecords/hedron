import React from 'react';
import * as SketchActions from '../../actions/SketchActions';
import InputSelectAudio from './InputSelectAudio';
import MidiLearn from './MidiLearn';

export default class ModifierInputSelect extends React.Component {

	constructor(props) {
		super(props);

		this.handleTypeChange = this.handleTypeChange.bind(this);
	}

	// Only update select inputs when needed
	shouldComponentUpdate(newProps) {

		// Has an input value
		if (newProps.input) {

			// Had input value before
			if (this.props.input) {
				// Check to see if input ID has changed
				return this.props.input.id !== newProps.input.id;
			} else {
				// Didn't have input before
				return true;
			}
		
		// Doesn't now but did have before
		} else if (this.props.input) {

			return true

		} else {

			return false
			
		}
        
    }

	handleTypeChange(e) {
		const type = e.target.value;
		let id = false;


	    switch(type) {

			case 'none':
				SketchActions.deleteSketchParamModifierInput(this.props.sketchId, this.props.paramKey, this.props.modifierId);
				break

			case 'midi':
				SketchActions.updateSketchParamModifierInput(this.props.sketchId, this.props.paramKey, this.props.modifierId, 'midi', null);
				break

			default:
				console.error('Input type not recognised: '+type);
		}

	  
	}

	render() {

		const paramKey = this.props.paramKey;

		let inputType, inputId;
		let select;

		if (this.props.input) {
			inputType = this.props.input.type;
			inputId = this.props.input.id;

			if (inputType == 'audio') {
				select = <InputSelectAudio inputId={inputId} sketchId={this.props.sketchId} paramKey={this.props.paramKey} />;
			} else if (inputType == 'midi') {
				select = <MidiLearn inputId={inputId} sketchId={this.props.sketchId} paramKey={this.props.paramKey} modifierId={this.props.modifierId} />;
			}

		} else {
			inputType = 'none';
			inputId = '';
			select = '';
		}

		return (
		  
		  <div>
	          <select value={inputType} onChange={this.handleTypeChange}>
	          		<option value="none">None</option>
	          		<option value="midi">MIDI</option>
	          </select>

	          {select}
          </div>
		)
	}

}